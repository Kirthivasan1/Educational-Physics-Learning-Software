import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const [userEmail, setUserEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isHoveringCreate, setIsHoveringCreate] = useState(false);
  const [isHoveringOpen, setIsHoveringOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserEmail(parsed.email);
      } catch (error) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserEmail("");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-to-tr from-purple-900/20 via-transparent to-indigo-900/20 animate-[spin_30s_linear_infinite]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* Navbar with glass morphism effect */}
      <nav className="flex justify-between items-center p-6 backdrop-blur-md bg-white/5 border-b border-white/10 z-10 relative">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">CodePlay</span>
        </Link>
        
        {userEmail ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 group"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-md">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-200 font-medium">{userEmail}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "transform rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-2xl z-10 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">{userEmail}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition-colors duration-150 flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/signin" 
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Sign In</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 relative z-0">
        <div className="max-w-2xl w-full space-y-12 text-center relative">
          {/* Floating orb decoration */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600/30 rounded-full filter blur-3xl animate-[pulse_8s_ease-in-out_infinite]"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-indigo-600/20 rounded-full filter blur-3xl animate-[pulse_12s_ease-in-out_infinite]"></div>
          
          <div className="relative">
            <h1 className="text-6xl font-extrabold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-400 bg-[length:200%_auto] animate-gradient">
                CodePlay
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-lg mx-auto">
              Where ideas become reality through code. Build, experiment, and share in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <Link 
              to="/new" 
              className="relative group"
              onMouseEnter={() => setIsHoveringCreate(true)}
              onMouseLeave={() => setIsHoveringCreate(false)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-2xl shadow-2xl transition-all duration-500 ${isHoveringCreate ? 'opacity-100 blur-md scale-105' : 'opacity-0 blur-0 scale-100'}`}></div>
              <div className="relative h-full p-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 overflow-hidden group-hover:shadow-lg group-hover:shadow-purple-500/10">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-lg group-hover:rotate-6 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">New Playground</h3>
                <p className="text-gray-400">Start fresh with a clean slate and unlimited possibilities</p>
                <div className="mt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform group-hover:-translate-y-1">
                    Create Now
                  </button>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/viewPlaygrounds" 
              className="relative group"
              onMouseEnter={() => setIsHoveringOpen(true)}
              onMouseLeave={() => setIsHoveringOpen(false)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-blue-600/30 rounded-2xl shadow-2xl transition-all duration-500 ${isHoveringOpen ? 'opacity-100 blur-md scale-105' : 'opacity-0 blur-0 scale-100'}`}></div>
              <div className="relative h-full p-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 overflow-hidden group-hover:shadow-lg group-hover:shadow-indigo-500/10">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg group-hover:-rotate-6 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Your Playgrounds</h3>
                <p className="text-gray-400">Access and continue your existing projects</p>
                <div className="mt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform group-hover:-translate-y-1">
                    Browse Collection
                  </button>
                </div>
              </div>
            </Link>
          </div>

          {/* Floating particles */}
          <div className="absolute -bottom-20 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-[float_8s_ease-in-out_infinite]"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-[float_10s_ease-in-out_infinite_2s]"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-[float_12s_ease-in-out_infinite_1s]"></div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;