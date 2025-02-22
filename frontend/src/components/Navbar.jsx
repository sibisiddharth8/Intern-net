import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBars, FaTimes, FaUserFriends, FaClipboardList } from 'react-icons/fa';

const Navbar = ({ type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Link */}
          <div className="flex items-center">
            <Link
              to={type === 'admin' ? '/dashboard/admin' : '/dashboard/intern'}
              className="text-xl font-bold text-white"
            >
              Intern-net
            </Link>
            {/* Desktop Navigation Links for Admin */}
            {type === 'admin' && (
              <div className="hidden md:flex ml-6 space-x-6">
                <Link
                  to="/dashboard/admin/interns"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition duration-300"
                >
                  <FaUserFriends className="mr-1" />
                  Interns
                </Link>
                <Link
                  to="/dashboard/admin/tasks"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition duration-300"
                >
                  <FaClipboardList className="mr-1" />
                  Tasks
                </Link>
              </div>
            )}
          </div>
          {/* Desktop Logout Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-blue-400 transition duration-300"
            >
              Logout <FaSignOutAlt className="ml-2" />
            </button>
          </div>
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-300 hover:text-blue-400 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {type === 'admin' && (
              <>
                <Link
                  to="/dashboard/admin/interns"
                  className="block px-4 py-2 text-gray-300 hover:text-blue-400 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserFriends className="inline mr-2" />
                  Interns
                </Link>
                <Link
                  to="/dashboard/admin/tasks"
                  className="block px-4 py-2 text-gray-300 hover:text-blue-400 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <FaClipboardList className="inline mr-2" />
                  Tasks
                </Link>
              </>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-4 py-2 text-gray-300 hover:text-blue-400 transition duration-300"
            >
              Logout <FaSignOutAlt className="inline ml-2" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
