// src/components/RoleProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Ensure this is stored on login

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to the proper dashboard based on the user's role
    return (
      <Navigate
        to={userRole === 'admin' ? '/dashboard/admin' : '/dashboard/intern'}
        replace
      />
    );
  }

  return children;
};

export default RoleProtectedRoute;
