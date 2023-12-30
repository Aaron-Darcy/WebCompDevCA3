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
        <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center">
            <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
                {/* Login Form */}
                <form className="space-y-4" onSubmit={handleLogin}>
                    {/* Username Input */}
                    <div>
                        <label className="block text-gray-700" htmlFor="username">Username</label>
                        <input
                            className="mt-1 w-full px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            id="username" type="text" placeholder="Username"
                            value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    {/* Password Input */}
                    <div>
                        <label className="block text-gray-700" htmlFor="password">Password</label>
                        <input
                            className="mt-1 w-full px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            id="password" type="password" placeholder="Password"
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {/* Submit Button */}
                    <button
                        className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Log In
                    </button>
                    {/* Feedback Message */}
                    {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
                </form>
            </div>

            {/* Tailwind Testimonial Component */}
            <section className="mt-10 relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
                <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
                <div className="mx-auto max-w-2xl lg:max-w-4xl">
                    <img className="mx-auto h-12" src="https://tailwindui.com/img/logos/workcation-logo-indigo-600.svg" alt="" />
                    <figure className="mt-10">
                        <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
                            <p>
                                “I recomend this book shop. It sells great books. My favourite part of the book shop is book.”
                            </p>
                        </blockquote>
                        <figcaption className="mt-10">
                            <img
                                className="mx-auto h-10 w-10 rounded-full"
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                            />
                            <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                <div className="font-semibold text-gray-900">Judith Black</div>
                                <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900">
                                    <circle cx={1} cy={1} r={1} />
                                </svg>
                                <div className="text-gray-600">CEO of Workcation</div>
                            </div>
                        </figcaption>
                    </figure>
                </div>
            </section>
        </div>
    );
}
export default LoginPage;
