import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminInterns from './AdminInterns';
import AdminTasks from './AdminTasks';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <Navbar type="admin" />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Navigate to="interns" replace />} />
          <Route path="interns" element={<AdminInterns />} />
          <Route path="tasks" element={<AdminTasks />} />

          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-full py-56">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <p className="text-lg mb-8">
                Sorry, the page you are looking for does not exist.
              </p>
              <a
                href="/"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Go Back to Dashboard
              </a>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
