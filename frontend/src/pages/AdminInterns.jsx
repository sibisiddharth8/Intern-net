import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axiosInstance';
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSyncAlt,
  FaUserGraduate,
} from 'react-icons/fa';
import EditInternModal from '../components/EditInternModal';
import Notification from '../components/Notification';
import ActionConfirmModal from '../components/ActionConfirmModal';

const AdminInterns = () => {
  const [interns, setInterns] = useState([]);
  const [newIntern, setNewIntern] = useState({
    email: '',
    name: '',
    password: '',
    collegeName: '',
  });
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [loading, setLoading] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const internsPerPage = 3;

  // Fetch interns from backend
  const fetchInterns = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/interns');
      setInterns(res.data);
    } catch (err) {
      setNotification({ type: 'error', message: 'Error fetching interns' });
      console.error('Error fetching interns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  // Compute distinct college names from intern data
  const distinctColleges = useMemo(() => {
    const colleges = interns
      .map((intern) => intern.collegeName)
      .filter((college) => college && college.trim() !== '');
    return Array.from(new Set(colleges));
  }, [interns]);

  // Dropdown options for filtering
  const collegeFilterOptions = useMemo(
    () => ['All', ...distinctColleges],
    [distinctColleges]
  );

  // Filter interns based on the selected college
  const filteredInterns = useMemo(() => {
    if (selectedCollege === 'All') return interns;
    return interns.filter((intern) => intern.collegeName === selectedCollege);
  }, [interns, selectedCollege]);

  // Reset page if filtered interns change and current page exceeds total pages
  useEffect(() => {
    const totalPages = Math.ceil(filteredInterns.length / internsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredInterns, currentPage, internsPerPage]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredInterns.length / internsPerPage);
  const indexOfLastIntern = currentPage * internsPerPage;
  const indexOfFirstIntern = indexOfLastIntern - internsPerPage;
  const currentInterns = filteredInterns.slice(
    indexOfFirstIntern,
    indexOfLastIntern
  );

  const createIntern = async () => {
    try {
      await axios.post('/interns', newIntern);
      setNotification({ type: 'success', message: 'Intern created successfully' });
      setNewIntern({ email: '', name: '', password: '', collegeName: '' });
      fetchInterns();
    } catch (err) {
      setNotification({ type: 'error', message: 'Error creating intern' });
    }
  };

  const deleteIntern = async (internId) => {
    try {
      await axios.delete(`/interns/${internId}`);
      setNotification({ type: 'success', message: 'Intern deleted successfully' });
      fetchInterns();
    } catch (err) {
      setNotification({ type: 'error', message: 'Error deleting intern' });
    }
  };

  const handleEditClick = (intern) => {
    setEditingIntern(intern);
    setIsModalOpen(true);
  };

  // Pagination Handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setCurrentPage(i + 1)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === i + 1
              ? 'bg-blue-500 text-white'
              : 'dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {i + 1}
        </button>
      ));
    } else {
      const pages = [];

      // Always show first page
      pages.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        pages.push(<span key="start-ellipsis" className="mx-1">...</span>);
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="end-ellipsis" className="mx-1">...</span>);
      }

      // Always show last page
      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {totalPages}
        </button>
      );

      return pages;
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <h2 className="text-3xl font-bold flex items-center mb-6">
          <FaUserGraduate className="mr-2" /> Manage Interns
        </h2>

        {/* Notification */}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Intern Creation Form */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold flex items-center mb-4">
            <FaPlus className="mr-2" /> Create New Intern
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createIntern();
            }}
            className="grid grid-cols-1 gap-6"
          >
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={newIntern.email}
                onChange={(e) =>
                  setNewIntern({ ...newIntern, email: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                value={newIntern.name}
                onChange={(e) =>
                  setNewIntern({ ...newIntern, name: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            {/* College Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                College Name
              </label>
              <input
                type="text"
                placeholder="Enter or select College Name"
                list="collegeOptions"
                value={newIntern.collegeName}
                onChange={(e) =>
                  setNewIntern({ ...newIntern, collegeName: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <datalist id="collegeOptions">
                {collegeFilterOptions
                  .filter((opt) => opt !== 'All')
                  .map((college, idx) => (
                    <option key={idx} value={college} />
                  ))}
              </datalist>
            </div>
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={newIntern.password}
                onChange={(e) =>
                  setNewIntern({ ...newIntern, password: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className="mt-4 w-max flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
              >
                <FaPlus className="mr-2" /> Create Intern
              </button>
            </div>
          </form>
        </div>

        {/* College Filter & Refresh */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="mb-6 w-max">
            <label className="block mb-2 text-lg">Filter Interns by College:</label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="p-2 w-full bg-gray-200 dark:bg-gray-700 rounded focus:outline-none"
            >
              {collegeFilterOptions.map((college, idx) => (
                <option key={idx} value={college}>
                  {college}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchInterns}
            disabled={loading}
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-400 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <FaSyncAlt className="mr-2 animate-spin" /> Refreshing...
              </>
            ) : (
              <>
                <FaSyncAlt className="mr-2" /> Refresh List
              </>
            )}
          </button>
        </div>

        {/* Intern List */}
        <div>
          <h3 className="text-2xl font-semibold flex items-center mb-4">
            Intern List
          </h3>
          {currentInterns.length > 0 ? (
            currentInterns.map((intern) => (
              <div
                key={intern._id}
                className="bg-white dark:bg-gray-800 p-4 rounded mb-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow"
              >
                <div className="mb-4 md:mb-0">
                  <p className="text-xl font-bold">{intern.name}</p>
                  <p className="text-sm">{intern.email}</p>
                  {intern.collegeName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      College: {intern.collegeName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                  <button
                    onClick={() => handleEditClick(intern)}
                    className="flex items-center text-blue-400 hover:text-blue-600 transition cursor-pointer"
                  >
                    <FaEdit className="mr-1" /> <span>Edit</span>
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({
                        action: () => deleteIntern(intern._id),
                        message: 'Are you sure you want to delete this intern?',
                      })
                    }
                    className="flex items-center text-red-400 hover:text-red-600 transition cursor-pointer"
                  >
                    <FaTrash className="mr-1" /> <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No interns found for the selected college.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-10">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="mx-2 px-3 py-1 dark:bg-gray-700 dark:text-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {renderPageNumbers()}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="mx-2 px-3 py-1 dark:bg-gray-700 dark:text-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Edit Intern Modal */}
        {isModalOpen && editingIntern && (
          <EditInternModal
            isOpen={isModalOpen}
            intern={editingIntern}
            onClose={() => setIsModalOpen(false)}
            onUpdate={fetchInterns}
          />
        )}

        {/* Action Confirm Modal for deletion */}
        {confirmAction && (
          <ActionConfirmModal
            message={confirmAction.message}
            onConfirm={() => {
              confirmAction.action();
              setConfirmAction(null);
            }}
            onCancel={() => setConfirmAction(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminInterns;
