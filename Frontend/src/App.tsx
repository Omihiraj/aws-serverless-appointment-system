import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from "react-toastify";
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './utils/aws-exports.js';

Amplify.configure(amplifyConfig);
export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleSignIn = () => {
    setIsAuthenticated(true);
  };
  return <BrowserRouter>
      <div className="w-full min-h-screen bg-gray-50">
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn onSignIn={handleSignIn} />} />
          <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/signin'} />} />
        </Routes>
      </div>
    </BrowserRouter>;
}