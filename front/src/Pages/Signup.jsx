import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password } = formData;

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
      const body = JSON.stringify({ name, email, password });
      await axios.post('http://localhost:5000/api/users/signup', body, config);
      navigate('/login');
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Registration failed'
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center overflow-hidden relative">
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 bg-gray-800 bg-opacity-90 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.5)] border border-cyan-500 backdrop-blur-sm"
      >
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 drop-shadow-md font-mono">
          JOIN THE RIFT
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-200 rounded text-center">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-cyan-300 text-sm font-bold mb-2 font-mono">
              USERNAME
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all border border-gray-600 placeholder-gray-400"
              placeholder="Enter your gamertag"
              required
            />
          </div>
          <div>
            <label className="block text-cyan-300 text-sm font-bold mb-2 font-mono">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all border border-gray-600 placeholder-gray-400"
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-cyan-300 text-sm font-bold mb-2 font-mono">
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all border border-gray-600 placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition duration-300 font-mono tracking-wider"
          >
            INITIALIZE ACCOUNT
          </motion.button>
        </form>
        <p className="mt-8 text-center text-gray-400 text-sm">
          Already verified?{' '}
          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-colors"
          >
            Access Terminal
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
