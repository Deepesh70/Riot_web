import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {/* Background Video */}
            <video
                src="/videos/hero-4.mp4"
                autoPlay
                loop
                muted
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

            {/* Content Container */}
            <div className="relative z-20 flex h-full items-center justify-center p-4">
                <div className="w-full max-w-md bg-black/30 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h1 className="special-font hero-heading text-blue-75 text-center text-4xl mb-2">
                        R<b>I</b>OT
                    </h1>
                    <h2 className="text-2xl font-bold mb-6 text-center text-blue-100 font-robert-regular">Welcome Back</h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 font-general">
                        <div>
                            <label className="block text-blue-50 mb-1 text-xs uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-300 focus:bg-white/20 transition-all backdrop-blur-sm"
                                placeholder="ENTER YOUR EMAIL"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-blue-50 mb-1 text-xs uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-300 focus:bg-white/20 transition-all backdrop-blur-sm"
                                placeholder="ENTER YOUR PASSWORD"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] uppercase tracking-wide"
                        >
                            Log In
                        </button>
                    </form>

                    <p className="mt-6 text-center text-blue-50 text-sm font-general">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-yellow-300 hover:text-yellow-200 hover:underline">
                            Sign up
                        </Link>
                    </p>
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-blue-50/60 hover:text-blue-50 text-xs font-general uppercase tracking-widest">Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
