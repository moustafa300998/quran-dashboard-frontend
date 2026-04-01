import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Login from "./Login";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const api = useMemo(() => {
  return axios.create({
    // امسح localhost وحط اللينك ده بالظبط
    baseURL: "https://quran-api-ei9c.onrender.com", 
    headers: { Authorization: `Bearer ${token}` },
  });
}, [token]);

  useEffect(() => {
    if (token) fetchStudents();
    else setLoading(false);
  }, [token]);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const addPayment = async (studentId) => {
    const amount = window.prompt("Enter payment amount ($):");
    if (amount && !isNaN(amount)) {
      try {
        await api.post("/payments", { 
          studentId: parseInt(studentId), 
          amount: parseFloat(amount) 
        });
        fetchStudents();
      } catch (err) {
        alert("Error adding payment.");
      }
    }
  };

  const markAttendance = async (studentId) => {
    try {
      await api.post("/attendance", { studentId: parseInt(studentId) });
      fetchStudents();
    } catch (err) {
      alert("خطأ في تسجيل الحضور (قد يكون مسجلاً بالفعل اليوم)");
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesName = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "All" || String(s.level) === String(levelFilter);
    return matchesName && matchesLevel;
  });

  // --- الجزء المعدل لحساب الإحصائيات ---
  const stats = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    return {
      totalStudents: students.length,
      // 1. حساب إجمالي الحضور لكل الطلاب (عشان العداد اللي فوق يشتغل زي اللي تحت)
      totalAttendance: students.reduce((acc, s) => acc + (s.attendances?.length || 0), 0),
      // 2. حساب حضور اليوم فقط (لو حبيت تستخدمه في مكان تاني)
      todayAttendance: students.filter(s => 
        s.attendances?.some(a => new Date(a.date).toLocaleDateString('en-CA') === todayStr)
      ).length,
      totalRevenue: students.reduce((acc, s) => acc + (s.payments?.reduce((sum, p) => sum + p.amount, 0) || 0), 0),
      monthlyRevenue: students.reduce((acc, s) => {
        const monthSum = s.payments?.filter(p => new Date(p.date) >= startOfMonth)
          .reduce((sum, p) => sum + p.amount, 0) || 0;
        return acc + monthSum;
      }, 0)
    };
  }, [students]);

  const chartData = students.map(s => ({
    name: s.name,
    amount: s.payments?.reduce((sum, p) => sum + p.amount, 0) || 0,
  }));

  const addStudent = async () => {
    if (!name || !level) return;
    await api.post("/students", { name, level: String(level) });
    fetchStudents();
    setName(""); setLevel("");
  };

  const updateStudent = async () => {
    try {
      await api.put(`/students/${editingId}`, { name, level: String(level) });
      fetchStudents();
      setEditingId(null);
      setName(""); setLevel("");
    } catch (err) {
      alert("Update failed!");
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/students/${id}`);
      fetchStudents();
    }
  };

  if (!token) return <Login setToken={setToken} />;
  if (loading) return <div className="flex h-screen items-center justify-center font-bold">جاري التحميل...</div>;

  const themeClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardClass = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-white shadow-sm";
  const inputClass = darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 text-black";

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${themeClass}`}>
      
      {/* HEADER */}
      <div className={`max-w-6xl mx-auto p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 justify-between items-center mb-8 ${cardClass}`}>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Dashboard 🚀
        </h1>
        <div className="flex flex-1 gap-2 w-full md:w-auto">
          <input
            className={`border p-2 rounded-lg flex-1 outline-none focus:ring-2 focus:ring-blue-400 ${inputClass}`}
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            value={levelFilter} 
            onChange={(e) => setLevelFilter(e.target.value)}
            className={`p-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-400 ${inputClass}`}
          >
            <option value="All">All Levels</option>
            {[...new Set(students.map(s => s.level))].map(l => (
              <option key={l} value={l}>Level {l}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </div>

      {/* STATS - تم تعديل القيمة هنا لتظهر الإجمالي */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Students" value={stats.totalStudents} color="text-blue-500" dark={darkMode} />
        <StatCard title="Attendance" value={stats.totalAttendance} color="text-green-500" dark={darkMode} />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} color="text-purple-500" dark={darkMode} />
        <StatCard title="Monthly" value={`$${stats.monthlyRevenue}`} color="text-orange-500" dark={darkMode} />
      </div>

      {/* CHART */}
      <div className={`max-w-6xl mx-auto p-6 rounded-2xl shadow-lg mb-8 ${cardClass}`}>
        <h3 className="font-bold mb-4 italic text-sm md:text-base text-center md:text-left">Earnings Overview</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="name" stroke={darkMode ? "#9CA3AF" : "#4B5563"} tick={{fontSize: 12}} />
              <YAxis stroke={darkMode ? "#9CA3AF" : "#4B5563"} tick={{fontSize: 12}} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1F2937" : "#fff", borderRadius: "8px", border: "none" }} />
              <Bar dataKey="amount" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ADD FORM */}
      <div className={`max-w-6xl mx-auto p-4 rounded-2xl shadow-lg mb-8 flex flex-col md:flex-row gap-3 ${cardClass}`}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Student Name" className={`border p-2 rounded-lg flex-1 ${inputClass}`} />
        <input value={level} onChange={e => setLevel(e.target.value)} placeholder="Level" className={`border p-2 rounded-lg flex-1 ${inputClass}`} />
        <button onClick={editingId ? updateStudent : addStudent} className={`px-6 py-2 rounded-lg text-white font-bold transition ${editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}>
          {editingId ? "Update" : "Add Student"}
        </button>
      </div>

      {/* STUDENT CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(s => {
          const lastPayment = s.payments?.length > 0 ? new Date(Math.max(...s.payments.map(p => new Date(p.date)))) : null;
          const isOverdue = !lastPayment || (new Date() - lastPayment > 30 * 24 * 60 * 60 * 1000);

          return (
            <div key={s.id} className={`p-5 rounded-2xl shadow-md border-t-4 transition-transform hover:scale-105 ${cardClass} ${isOverdue ? 'border-red-500' : 'border-green-500'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg truncate w-2/3">{s.name}</h3>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {isOverdue ? "Overdue" : "Paid"}
                </span>
              </div>
              <p className="text-blue-400 font-medium text-sm">Level: {s.level}</p>
              <p className={`text-xs mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Attendance: {s.attendances?.length || 0} days
              </p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setName(s.name); setLevel(s.level); setEditingId(s.id); }} className="flex-1 bg-yellow-100 text-yellow-700 py-1 rounded-lg font-bold hover:bg-yellow-200 transition text-xs">Edit</button>
                <button onClick={() => addPayment(s.id)} className="flex-1 bg-green-100 text-green-700 py-1 rounded-lg font-bold hover:bg-green-200 transition text-xs">Pay</button>
                <button onClick={() => markAttendance(s.id)} className="flex-1 bg-blue-100 text-blue-700 py-1 rounded-lg font-bold hover:bg-blue-200 transition text-xs">حضر</button>
                <button onClick={() => deleteStudent(s.id)} className="w-full bg-red-50 text-red-600 py-1 rounded-lg font-bold hover:bg-red-100 transition text-xs">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ title, value, color, dark }) {
  return (
    <div className={`p-5 rounded-2xl shadow-lg text-center border transition-all hover:shadow-xl ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-white"}`}>
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
      <h2 className={`text-2xl font-black ${color}`}>{value}</h2>
    </div>
  );
}

export default App;