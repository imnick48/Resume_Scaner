import React from 'react';

const HomePreview = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/login';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="p-8 rounded-lg shadow-2xl bg-white/10 backdrop-blur-md">
        <h1 className="text-4xl font-bold mb-6 text-white">Welcome</h1>
        <button
          onClick={handleLogin}
          className="px-8 py-3 rounded-full bg-white text-purple-600 font-semibold hover:bg-opacity-90 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default HomePreview;