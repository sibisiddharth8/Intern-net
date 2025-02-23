import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserFriends,
  FaClipboardList,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import { MdTask } from 'react-icons/md';
import Logo from '../assets/Xecute.svg';

const Navbar = ({ type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Helper to check active link
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo and Main Link */}
          <div className="flex items-center justify-center gap-12">
            {/* Logo: Route based on login type */}
            <Link
              to={type === 'admin' ? '/dashboard/admin' : type === 'intern' ? '/dashboard/intern' : '/'}
              className="flex items-center justify-center gap-2 text-3xl font-bold text-gray-800 dark:text-white"
            >
              <img src={Logo} alt="Xecute Logo" className="w-10 h-10 mt-1" />
              Xecute
            </Link>

            {/* Desktop Navigation Links for Admin */}
            {type === 'admin' && (
              <div className="hidden md:flex md:items-center md:justify-center gap-6 md:mt-1">
                <Link
                  to="/dashboard/admin/interns"
                  className={`flex items-center justify-center text-lg px-3 py-1 rounded transition duration-300 ${
                    isActive('/dashboard/admin/interns')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FaUserFriends className="mr-1" />
                  Interns
                </Link>
                <Link
                  to="/dashboard/admin/tasks"
                  className={`flex items-center justify-center text-lg px-3 py-1 rounded transition duration-300 ${
                    isActive('/dashboard/admin/tasks')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <MdTask className="mr-1" />
                  Tasks
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Right Section: Dark Mode Toggle & Logout */}
          <div className="hidden md:flex items-center gap-4">
            {/* You can add a dark mode toggle here if needed */}
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-800 dark:text-gray-300 hover:text-red-600 cursor-pointer transition duration-300"
            >
              Logout <FaSignOutAlt className="ml-2" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition duration-300"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {type === 'admin' && (
              <>
                <Link
                  to="/dashboard/admin/interns"
                  className={`block px-4 py-2 transition duration-300 ${
                    isActive('/dashboard/admin/interns')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserFriends className="inline mr-2" />
                  Interns
                </Link>
                <Link
                  to="/dashboard/admin/tasks"
                  className={`block px-4 py-2 transition duration-300 ${
                    isActive('/dashboard/admin/tasks')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
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
              className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-300 hover:text-red-600 transition duration-300"
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
