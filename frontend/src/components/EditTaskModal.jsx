import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axiosInstance';
import Notification from './Notification';
import MultiSelect from './MultiSelect';

const EditTaskModal = ({ isOpen, task, interns, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    internIds: []
  });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collegeFilter, setCollegeFilter] = useState('All');

  // Pre-fill form data when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
        internIds: task.internIds || []
      });
    }
  }, [task]);

  // Compute distinct college names from interns list
  const distinctColleges = useMemo(() => {
    const colleges = interns.map(intern => intern.collegeName).filter(Boolean);
    return ['All', ...Array.from(new Set(colleges))];
  }, [interns]);

  // Filter interns based on selected college in the modal
  const filteredInterns = useMemo(() => {
    if (collegeFilter === 'All') return interns;
    return interns.filter(intern => intern.collegeName === collegeFilter);
  }, [interns, collegeFilter]);

  // Compute selected intern objects for display (optional)
  const selectedInterns = useMemo(() => {
    return interns.filter(intern => formData.internIds.includes(intern._id));
  }, [interns, formData.internIds]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/tasks/${task._id}`, {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        internIds: formData.internIds
      });
      setNotification({ type: 'success', message: 'Task updated successfully!' });
      if (onUpdate) onUpdate();
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Error updating task'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black opacity-70 z-40 w-full" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-2xl relative">
          <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                required
              ></textarea>
            </div>
            {/* Due Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            {/* College Filter in Modal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter Interns by College</label>
              <select
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {distinctColleges.map((college, idx) => (
                  <option key={idx} value={college}>{college}</option>
                ))}
              </select>
            </div>
            {/* MultiSelect for Intern Assignment */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Assign to Interns</label>
              <MultiSelect
                options={filteredInterns}
                selectedOptions={formData.internIds}
                onChange={(selected) =>
                  setFormData({ ...formData, internIds: selected })
                }
              />
              {/* (Optional) Display selected intern names */}
              {selectedInterns.length > 0 && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: {selectedInterns.map(intern => intern.name).join(', ')}
                </div>
              )}
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
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition"
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

export default EditTaskModal;
