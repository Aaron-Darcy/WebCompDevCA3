// LoginPage.js
// Imports
import React, { useState } from 'react';
import users from './UserLogIns';  
import { useNavigate } from 'react-router-dom';  

const LoginPage = () => {

    // State management for Login
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    // useNavigate hook for redirection
    const navigate = useNavigate(); 

    // Handle login when the user submits the form
    const handleLogin = (e) => {
        e.preventDefault(); 
        // Find the user based on the username and password
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Redirect the user based on their role
            if (user.Role === 'Admin') {
                // Navigate to Admin Dashboard
                navigate('/adminDashboard'); 
            } else if (user.Role === 'Customer') {
                // Navigate to Customer Page
                navigate('/customerPage'); 
            }
        } else {
            // Set a message if login details are invalid
            setMessage("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
                {/* Form for login */}
                <form className="space-y-4" onSubmit={handleLogin}>
                    {/* Username input */}
                    <div>
                        <label className="block text-gray-700" htmlFor="username">Username</label>
                        <input
                            className="mt-1 w-full px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            id="username" type="text" placeholder="Username"
                            value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    {/* Password input */}
                    <div>
                        <label className="block text-gray-700" htmlFor="password">Password</label>
                        <input
                            className="mt-1 w-full px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            id="password" type="password" placeholder="Password"
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {/* Submit button */}
                    <button
                        className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Log In
                    </button>
                    {/* Message display for feedback */}
                    {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
