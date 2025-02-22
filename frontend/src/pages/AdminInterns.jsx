import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axiosInstance';
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaEnvelope, 
  FaUser, 
  FaLock, 
  FaUniversity, 
  FaSyncAlt, 
  FaUserGraduate 
} from 'react-icons/fa';

const AdminInterns = () => {
  const [interns, setInterns] = useState([]);
  const [newIntern, setNewIntern] = useState({
    email: '',
    name: '',
    password: '',
    collegeName: ''
  });
  const [selectedCollege, setSelectedCollege] = useState('All');

  // Fetch interns from backend
  const fetchInterns = async () => {
    try {
      const res = await axios.get('/interns');
      setInterns(res.data);
    } catch (err) {
      console.error('Error fetching interns:', err);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  // Compute distinct college names from intern data
  const distinctColleges = useMemo(() => {
    const colleges = interns
      .map(intern => intern.collegeName)
      .filter(college => college && college.trim() !== '');
    return Array.from(new Set(colleges));
  }, [interns]);

  // Dropdown options for filtering
  const collegeFilterOptions = useMemo(() => {
    return ['All', ...distinctColleges];
  }, [distinctColleges]);

  // Filter interns based on the selected college
  const filteredInterns = useMemo(() => {
    if (selectedCollege === 'All') return interns;
    return interns.filter(intern => intern.collegeName === selectedCollege);
  }, [interns, selectedCollege]);

  const createIntern = async () => {
    try {
      await axios.post('/interns', newIntern);
      alert('Intern created');
      setNewIntern({ email: '', name: '', password: '', collegeName: '' });
      fetchInterns();
    } catch (err) {
      alert('Error creating intern');
    }
  };

  const editIntern = async (intern) => {
    const newName = prompt('Enter new name:', intern.name);
    if (!newName) return;
    const newEmail = prompt('Enter new email:', intern.email);
    if (!newEmail) return;
    const newCollege = prompt('Enter new college name:', intern.collegeName || '');
    const newPassword = prompt('Enter new password (leave blank to keep current):', '');
    try {
      await axios.put(`/interns/${intern._id}`, {
        name: newName,
        email: newEmail,
        collegeName: newCollege,
        password: newPassword || undefined,
      });
      alert('Intern updated');
      fetchInterns();
    } catch (err) {
      alert('Error updating intern');
    }
  };

  const deleteIntern = async (internId) => {
    if (!window.confirm("Are you sure you want to delete this intern?")) return;
    try {
      await axios.delete(`/interns/${internId}`);
      alert('Intern deleted');
      fetchInterns();
    } catch (err) {
      alert('Error deleting intern');
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <h2 className="text-3xl font-bold flex items-center mb-6">
          <FaUserGraduate className="mr-2" /> Manage Interns
        </h2>

        {/* Intern Creation Form */}
        <div className="mb-8 p-6 bg-gray-800 rounded shadow">
          <h3 className="text-2xl font-semibold flex items-center mb-4">
            <FaPlus className="mr-2" /> Create New Intern
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {/* Email Field */}
            <div>
              <label className="flex items-center text-sm text-gray-300 mb-1">
                <FaEnvelope className="text-blue-400" />
                <span className="ml-2">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                value={newIntern.email}
                onChange={(e) =>
                  setNewIntern({ ...newIntern, email: e.target.value })
                }
                className="p-2 w-full bg-gray-700 rounded focus:outline-none"
              />
            </div>
            {/* Name Field */}
            <div>
              <label className="flex items-center text-sm text-gray-300 mb-1">
                <FaUser className="text-blue-400" />
                <span className="ml-2">Name</span>
              </label>
              <input
                type="text"
                placeholder="Name"
                value={newIntern.name}
                onChange={(e) =>
                  setNewIntern({ ...newIntern, name: e.target.value })
                }
                className="p-2 w-full bg-gray-700 rounded focus:outline-none"
              />
            </div>
            {/* College Name Field with Datalist */}
            <div>
              <label className="flex items-center text-sm text-gray-300 mb-1">
                <FaUniversity className="text-blue-400" />
                <span className="ml-2">College Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter or select College Name"
                list="collegeOptions"
                value={newIntern.collegeName}
                onChange={(e) =>
                  setNewIntern({ ...newIntern, collegeName: e.target.value })
                }
                className="p-2 w-full bg-gray-700 rounded focus:outline-none"
              />
              <datalist id="collegeOptions">
                {distinctColleges.map((college, idx) => (
                  <option key={idx} value={college} />
                ))}
              </datalist>
            </div>
            {/* Password Field */}
            <div>
              <label className="flex items-center text-sm text-gray-300 mb-1">
                <FaLock className="text-blue-400" />
                <span className="ml-2">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                value={newIntern.password}
                onChange={(e) =>
                  setNewIntern({ ...newIntern, password: e.target.value })
                }
                className="p-2 w-full bg-gray-700 rounded focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={createIntern}
            className="mt-4 flex items-center justify-center bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <FaPlus className="mr-2" /> Create Intern
          </button>
        </div>

        {/* College Filter */}
        <div className="mb-6">
          <label className="block mb-2 text-lg">Filter Interns by College:</label>
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="p-2 w-full bg-gray-700 rounded focus:outline-none"
          >
            {collegeFilterOptions.map((college, idx) => (
              <option key={idx} value={college}>
                {college}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={fetchInterns}
            className="flex items-center text-sm text-gray-300 hover:text-blue-400 transition"
          >
            <FaSyncAlt className="mr-1" /> Refresh List
          </button>
        </div>

        {/* Intern List */}
        <div>
          <h3 className="text-2xl font-semibold flex items-center mb-4">
            <FaUserGraduate className="mr-2" /> Intern List
          </h3>
          {filteredInterns.length > 0 ? (
            filteredInterns.map((intern) => (
              <div
                key={intern._id}
                className="bg-gray-800 p-4 rounded mb-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow"
              >
                <div className="mb-4 md:mb-0">
                  <p className="text-xl font-bold">{intern.name}</p>
                  <p className="text-sm">{intern.email}</p>
                  {intern.collegeName && (
                    <p className="text-xs text-gray-400">College: {intern.collegeName}</p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                  <button 
                    onClick={() => editIntern(intern)} 
                    className="flex items-center hover:text-blue-400 transition"
                  >
                    <FaEdit className="mr-1" /> <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => deleteIntern(intern._id)} 
                    className="flex items-center hover:text-red-400 transition"
                  >
                    <FaTrash className="mr-1" /> <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">
              No interns found for the selected college.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInterns;
