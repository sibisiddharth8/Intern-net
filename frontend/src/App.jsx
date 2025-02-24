import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import InternDashboard from './pages/InternDashboard';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './contexts/ThemeContext';
import RoleProtectedRoute from './components/RoleProtectedRoute';

const App = () => {
  return (
    <ThemeProvider>
      
        <div className="min-h-dvh bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/admin/*"
              element={
                <RoleProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/dashboard/intern"
              element={
                <RoleProtectedRoute requiredRole="intern">
                  <InternDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      
    </ThemeProvider>
  );
};

export default App;
