// AuthContext.js
// Imports
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Provider component for auth context
export const AuthProvider = ({ children }) => {
  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State for user role
  const [userRole, setUserRole] = useState(null);

  // Function to handle login
  const login = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  // Function to handle logout
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  // Providing context to children
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, login, logout, userRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);
