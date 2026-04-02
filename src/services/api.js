import axios from 'axios';

const API_URL = "https://moustafa-quran-api.onrender.com";

// ✅ لازم نكريت الـ Instance الأول عشان نستخدمه تحت
const API = axios.create({
  baseURL: API_URL
});

// إضافة الـ Token تلقائياً في كل طلب بعد الـ Login
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// الدوال دلوقتي هتشتغل صح لأنها بتستخدم الـ API اللي عملناه فوق
export const fetchStats = () => API.get('/students/stats');
export const fetchStudents = () => API.get('/students');
export const addStudent = (studentData) => API.post('/students', studentData);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

export default API;