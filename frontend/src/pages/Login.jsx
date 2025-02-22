import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      if (res.data.user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/intern');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="h-[100vh] flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md w-80">
        <div className="flex justify-center mb-4">
          <FaUser size={40} className="text-blue-400" />
        </div>
        <h2 className="text-center text-2xl text-white font-semibold mb-2">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Sign in to access your account
        </p>
        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}
        <div className="flex items-center bg-gray-700 rounded p-2 mb-4">
          <FaEnvelope className="text-gray-400 mr-2" />
          <input
            type="email"
            placeholder="Email"
            className="bg-transparent focus:outline-none w-full text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center bg-gray-700 rounded p-2 mb-4">
          <FaLock className="text-gray-400 mr-2" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="bg-transparent focus:outline-none w-full text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
          className="cursor-pointer w-full flex justify-center items-center bg-blue-600 p-2 rounded hover:bg-blue-700 transition duration-300"
        >
          <FaSignInAlt className="mr-2" />
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
