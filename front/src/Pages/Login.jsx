import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify({ email, password });
      
      const res = await axios.post('http://localhost:5000/api/users/login', body, config);
      
      // Store token
      localStorage.setItem('token', res.data.token);
      
      navigate('/profile'); // Redirect to profile or home
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Login failed'
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 bg-[url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center overflow-hidden relative">
      <div className="absolute inset-0 bg-black opacity-75"></div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 bg-gray-800 bg-opacity-90 rounded-2xl shadow-[0_0_20px_rgba(147,51,234,0.5)] border border-purple-500 backdrop-blur-sm"
      >
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6 drop-shadow-md font-mono">
          SYSTEM LOGIN
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-200 rounded text-center">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-300 text-sm font-bold mb-2 font-mono">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all border border-gray-600 placeholder-gray-400"
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-purple-300 text-sm font-bold mb-2 font-mono">
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all border border-gray-600 placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transition duration-300 font-mono tracking-wider"
          >
            AUTHENTICATE
          </motion.button>
        </form>
        <p className="mt-8 text-center text-gray-400 text-sm">
          New Player?{' '}
          <Link
            to="/signup"
            className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-colors"
          >
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
