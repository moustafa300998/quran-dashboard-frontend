import { useState } from "react";
import axios from "axios";

function Login({ setToken }) {
  const [name, setName] = useState(""); // 👈 جديد
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setError("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      await axios.post("http://localhost:5000/auth/register", {
        name, // 👈 مهم جدًا
        email,
        password,
      });

      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setError("Register failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Welcome 👋</h2>

        {/* 👇 NAME */}
        <input
          className="border p-2 rounded w-full mb-3"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 rounded w-full mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="text-red-500 text-sm mb-2 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 text-white w-full p-2 rounded mb-2"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </div>
    </div>
  );
}

export default Login;