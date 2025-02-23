import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import Notification from './Notification';

const EditInternModal = ({ isOpen, onClose, intern, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeName: '',
    password: '',
  });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pre-fill form when intern changes
  useEffect(() => {
    if (intern) {
      setFormData({
        name: intern.name || '',
        email: intern.email || '',
        collegeName: intern.collegeName || '',
        password: '',
      });
    }
  }, [intern]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/interns/${intern._id}`, {
        name: formData.name,
        email: formData.email,
        collegeName: formData.collegeName,
        password: formData.password ? formData.password : undefined,
      });
      setNotification({ type: 'success', message: 'Intern updated successfully!' });
      if (onUpdate) onUpdate();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Error updating intern' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black opacity-70 z-40" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-2xl relative">
          <h2 className="text-2xl font-bold mb-4">Edit Intern</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                College Name
              </label>
              <input
                type="text"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave blank to keep current password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
          {notification && (
            <div className="mt-4">
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditInternModal;
