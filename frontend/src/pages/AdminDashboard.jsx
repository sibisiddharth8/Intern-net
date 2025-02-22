import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminInterns from './AdminInterns';
import AdminTasks from './AdminTasks';

const AdminDashboard = () => {
  return (
    <div>
      <Navbar type="admin" />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Navigate to="interns" replace />} />
          <Route path="interns" element={<AdminInterns />} />
          <Route path="tasks" element={<AdminTasks />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
