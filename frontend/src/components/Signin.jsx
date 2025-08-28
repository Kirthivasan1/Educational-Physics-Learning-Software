// src/components/Signin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css"


function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/signin",
        form
      );

      // ✅ Store token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Optional

      alert("Signed in successfully!");
      navigate("/"); // Redirect to homepage
    } catch (err) {
      alert(err.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Glassmorphism container */}
      <div className="relative backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 w-96 transform transition-all duration-300 hover:scale-105">
        {/* Glowing effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

        <form onSubmit={handleSubmit} className="relative z-10">
          {/* Header with icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-purple-200 text-sm">Sign in to your account</p>
          </div>

          {/* Email input with floating label effect */}
          <div className="relative mb-6 group">
            <input
              name="email"
              type="email"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm peer"
            />
            <label className="absolute left-4 -top-2.5 text-purple-200 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/60 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-purple-300 peer-focus:text-sm bg-transparent px-1">
              Email Address
            </label>
          </div>

          {/* Password input with floating label effect */}
          <div className="relative mb-8 group">
            <input
              name="password"
              type="password"
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm peer"
            />
            <label className="absolute left-4 -top-2.5 text-purple-200 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/60 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-purple-300 peer-focus:text-sm bg-transparent px-1">
              Password
            </label>
          </div>

          {/* Submit button with gradient and animations */}
          <button
            type="submit"
            className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          >
            <span className="relative z-20 flex items-center justify-center">
              <span className="mr-2">Sign In</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>

            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"></div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
            </div>
          </button>

          {/* Additional links */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-purple-200 hover:text-white transition-colors duration-300 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          {/* Sign Up redirect */}
          <div className="mt-4 text-center">
            <p className="text-purple-200">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-indigo-400 hover:text-indigo-300 underline transition-colors duration-200"
              >
                Sign Up
              </a>
            </p>
          </div>
        </form>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-700"></div>
      </div>
    </div>
  );
}

export default Signin;
