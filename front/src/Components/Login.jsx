import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from('.login-brand', { y: -30, opacity: 0, duration: 0.6 })
                .from('.login-heading', { y: 40, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.3')
                .from('.login-field', { x: -30, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.4')
                .from('.login-btn', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
                .from('.login-footer', { opacity: 0, duration: 0.5 }, '-=0.2')
                .fromTo('.login-video-panel',
                    { clipPath: 'inset(0 0 0 100%)' },
                    { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'expo.out' }, 0.2);
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        <div ref={containerRef} className="h-screen w-screen flex bg-[#0c0c0c] overflow-hidden">

            {/* ─── LEFT: Form Panel ─── */}
            <div className="w-full lg:w-[48%] h-full flex flex-col justify-between px-8 md:px-16 lg:px-20 py-10 relative z-10">

                {/* Top nav */}
                <div className="flex items-center justify-between">
                    <Link to="/" className="login-brand flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
                            <span className="text-white font-black text-base">R</span>
                        </div>
                        <span className="text-white font-black text-lg tracking-tight uppercase">Riot</span>
                    </Link>
                    <div className="login-brand flex items-center gap-8">
                        <Link to="/" className="text-white/50 hover:text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors">Home</Link>
                        <Link to="/signup" className="text-white/50 hover:text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors">Join</Link>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-[380px] w-full">
                    <p className="login-heading text-red-500 text-xs font-bold uppercase tracking-[0.25em] mb-4">Welcome Back</p>
                    <h1 className="login-heading text-white font-black text-5xl md:text-6xl uppercase leading-[0.95] mb-4">
                        Sign In
                    </h1>
                    <p className="login-heading text-white/40 text-sm mb-10">
                        Don't have an Account?{' '}
                        <Link to="/signup" className="text-red-400 hover:text-red-300 font-bold transition-colors">
                            Create One
                        </Link>
                    </p>

                    {error && (
                        <div className="login-field mb-6 px-4 py-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="login-field">
                            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">Email or Username</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input"
                                    placeholder="you@example.com"
                                    required
                                />
                                <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                        </div>

                        <div className="login-field">
                            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="auth-input"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                        </div>

                        <button type="submit" className="login-btn auth-submit-btn">
                            Login
                        </button>
                    </form>
                </div>

                {/* Bottom */}
                <div className="login-footer flex items-center gap-6">
                    {['Discord', 'Twitch', 'Twitter'].map(s => (
                        <span key={s} className="text-white/20 hover:text-white/50 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors">{s}</span>
                    ))}
                </div>
            </div>

            {/* ─── RIGHT: Video Panel ─── */}
            <div className="login-video-panel hidden lg:block w-[52%] h-full relative overflow-hidden" style={{ borderRadius: '2.5rem 0 0 2.5rem' }}>
                <video
                    src="/videos/hero-4.mp4"
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0c0c0c 0%, transparent 30%)' }} />
            </div>
        </div>
    );
};

export default Login;
