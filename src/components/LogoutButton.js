// LogoutButton.js
// Imports
import React from "react";
import { useAuth } from "./AuthContext.js";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  // Accessing the logout function from the AuthContext
  const { logout } = useAuth();
  // Hook to navigate
  const navigate = useNavigate();

  // Function to handle logout process
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Rendering the logout button
  return (
    <button
      onClick={handleLogout}
      className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded text-sm shadow-md transition-colors"
    >
      Log Out
    </button>
  );
}

export default LogoutButton;
