import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im'; // Import spinner icon
import Logo from '../assets/Xecute.svg';
import Notification from '../components/Notification';
import DeveloperLink from '../components/DeveloperLink';

// Loading overlay component
const LoadingOverlay = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black opacity-80 z-50">
    <ImSpinner2 className="w-12 h-12 text-white animate-spin" />
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: '' });
    setLoading(true); // Start loading and keep it until navigation

    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      localStorage.setItem('role', res.data.user.role); // Save role for protected routing

      // Show success notification
      setNotification({ message: 'Login successful!', type: 'success' });

      // Delay navigation while keeping the loader visible
      setTimeout(() => {
        if (res.data.user.role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/intern');
        }
        setLoading(false); // Turn off loader after navigation
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setNotification({ message: errorMessage, type: 'error' });
      setLoading(false); // Stop loading on error
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center min-h-screen bg-gray-300 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 relative">
      {loading && <LoadingOverlay />}
      <img
        src={Logo}
        alt="Logo"
        className="w-1/4 md:w-1/14 translate-y-1/2 translate-x-1 z-20"
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-8 mb-8 bg-gray-200 dark:bg-gray-800 p-8 rounded-xl shadow-md border w-80 z-10"
      >
        <div className="flex flex-col items-center justify-center gap-2 mt-2">
          <div className="mt-2">
            <h2 className="text-center text-3xl dark:text-white font-bold">
              Welcome Back!
            </h2>
            <p className="text-xs text-center dark:text-gray-400">
              Sign in to access your account
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <div className="flex items-center bg-gray-300 dark:bg-gray-700 rounded p-2 w-full">
            <FaEnvelope className="dark:text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent focus:outline-none w-full dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center bg-gray-300 dark:bg-gray-700 rounded p-2 w-full">
            <FaLock className="dark:text-gray-400 mr-2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="bg-transparent focus:outline-none w-full dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="cursor-pointer ml-2 text-gray-400 hover:text-blue-400 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-max flex justify-center items-center text-white px-4 py-2 mt-2 bg-blue-600 rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <ImSpinner2 className="mr-2 animate-spin" /> Logging in...
              </>
            ) : (
              <>
                <FaSignInAlt className="mr-2" /> Login
              </>
            )}
          </button>
        </div>
      </form>

      {/* Notification */}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default Login;
