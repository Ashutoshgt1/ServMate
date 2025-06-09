import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Home from './components/Home.js';
import CustomerRegistration from './components/CustomerRegisteration.js';
import CustomerLogin from './components/CustomerLogin.js';
import CustomerDashboard from './components/CustomerDashboard.js';

function App() {
  return (
    <Router>
          <Navbar />
      <div className="App">
        <Routes>
          {/* Home page with navbar */}
          <Route 
            path="/" 
            element={
              <>
                <Home />
              </>
            } 
          />
          
          {/* Customer Registration page (standalone without navbar) */}
          <Route 
            path="/customer/register" 
            element={<CustomerRegistration />} 
          />
          
          {/* Customer Login page (placeholder for future) */}
          <Route 
            path="/customer/login" 
            element={
              <CustomerLogin />
            } 
          />

          


          <Route 
            path="/customer/dashboard" 
            element={
              <CustomerDashboard />
            } 
          />
          
          {/* Provider Login page (placeholder for future) */}
          <Route 
            path="/provider/login" 
            element={
              <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-2xl">
                  <h2 className="text-2xl font-bold mb-4">Provider Login</h2>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </div>
            } 
          />
          
          {/* Provider Registration page (placeholder for future) */}
          <Route 
            path="/provider/register" 
            element={
              <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-2xl">
                  <h2 className="text-2xl font-bold mb-4">Provider Registration</h2>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </div>
            } 
          />
          
          {/* 404 Not Found page */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
                  <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
                  <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                  <a 
                    href="/" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;