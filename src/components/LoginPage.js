// LoginPage.js
// Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.js";
import UserLogIns from "./UserLogIns";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = UserLogIns.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      login(user.Role);
      navigate(user.Role === "Admin" ? "/adminDashboard" : "/customerPage");
    } else {
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Book Store
      </h1>
      <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Username Input */}
          <div>
            <label className="block text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              className="mt-1 w-full px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {/* Password Input */}
          <div>
            <label className="block text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className="mt-1 w-full px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Submit Button */}
          <button
            className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Log In
          </button>
          {/* Feedback Message */}
          {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
