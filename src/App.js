// App.js
// Imports
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import { useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard'; 
import CustomerPage from './components/CustomerPage';

function App() {

  // Test server connection
  useEffect(() => {
    fetch('http://localhost:3001/test')
      .then(response => response.text())
      .then(message => console.log(message));
  }, []);

  return (
    // Routes
      <Router>
        <div className="App">
          {/* Include LogoutButton wherever needed, perhaps in a Navbar or similar component */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/customerPage" element={<CustomerPage />} />
            {/* Redirect or other routes */}
          </Routes>
        </div>
      </Router>
  );
}

export default App;
