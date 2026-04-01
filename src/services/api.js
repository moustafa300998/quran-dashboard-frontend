import axios from 'axios';

const API_URL = "https://moustafa-quran-api.onrender.com";
// إضافة الـ Token تلقائياً في كل طلب بعد الـ Login
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchStats = () => API.get('/students/stats');
export const fetchStudents = () => API.get('/students');
export const addStudent = (studentData) => API.post('/students', studentData);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
// ... أي API تانية