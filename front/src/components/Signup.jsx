import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [riotGameName, setRiotGameName] = useState('');
    const [riotTagLine, setRiotTagLine] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from('.signup-brand', { y: -30, opacity: 0, duration: 0.6 })
                .from('.signup-heading', { y: 40, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.3')
                .from('.signup-field', { x: -30, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.4')
                .from('.signup-btn', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
                .from('.signup-footer', { opacity: 0, duration: 0.5 }, '-=0.2')
                .fromTo('.signup-video-panel',
                    { clipPath: 'inset(0 0 0 100%)' },
                    { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'expo.out' }, 0.2);
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, riotGameName, riotTagLine }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div ref={containerRef} className="h-screen w-screen flex bg-[#0c0c0c] overflow-hidden">

            {/* ─── LEFT: Form Panel ─── */}
            <div className="w-full lg:w-[48%] h-full flex flex-col justify-between px-8 md:px-16 lg:px-20 py-8 relative z-10">

                {/* Top nav */}
                <div className="flex items-center justify-between flex-shrink-0">
                    <Link to="/" className="signup-brand flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
                            <span className="text-white font-black text-base">R</span>
                        </div>
                        <span className="text-white font-black text-lg tracking-tight uppercase">Riot</span>
                    </Link>
                    <div className="signup-brand flex items-center gap-8">
                        <Link to="/" className="text-white/50 hover:text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors">Home</Link>
                        <Link to="/login" className="text-white/50 hover:text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors">Sign In</Link>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-[380px] w-full flex-shrink-0">
                    <p className="signup-heading text-red-500 text-xs font-bold uppercase tracking-[0.25em] mb-4">Start For Free</p>
                    <h1 className="signup-heading text-white font-black text-4xl md:text-5xl uppercase leading-[0.95] mb-4">
                        Create New<br />Account
                    </h1>
                    <p className="signup-heading text-white/40 text-sm mb-8">
                        Already A Member?{' '}
                        <Link to="/login" className="text-red-400 hover:text-red-300 font-bold transition-colors">
                            Log In
                        </Link>
                    </p>

                    {error && (
                        <div className="signup-field mb-5 px-4 py-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="signup-field">
                            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="auth-input"
                                    placeholder="Your Name"
                                    required
                                />
                                <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                                </svg>
                            </div>
                        </div>

                        <div className="signup-field">
                            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">Email</label>
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

                        <div className="signup-field">
                            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">Password</label>
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

                        <div className="signup-field flex gap-3">
                            <div className="flex-1">
                                <label className="block text-white/50 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">Riot Game Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={riotGameName}
                                        onChange={(e) => setRiotGameName(e.target.value)}
                                        className="auth-input"
                                        placeholder="User"
                                    />
                                    <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-24">
                                <label className="block text-white/50 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">Tag</label>
                                <input
                                    type="text"
                                    value={riotTagLine}
                                    onChange={(e) => setRiotTagLine(e.target.value)}
                                    className="auth-input"
                                    placeholder="#9021"
                                />
                            </div>
                        </div>

                        <button type="submit" className="signup-btn auth-submit-btn">
                            Create Account
                        </button>
                    </form>
                </div>

                {/* Bottom */}
                <div className="signup-footer flex items-center gap-6 flex-shrink-0">
                    {['Discord', 'Twitch', 'Twitter'].map(s => (
                        <span key={s} className="text-white/20 hover:text-white/50 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors">{s}</span>
                    ))}
                </div>
            </div>

            {/* ─── RIGHT: Video Panel ─── */}
            <div className="signup-video-panel hidden lg:block w-[52%] h-full relative overflow-hidden" style={{ borderRadius: '2.5rem 0 0 2.5rem' }}>
                <video
                    src="/videos/feature-5.mp4"
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0c0c0c 0%, transparent 30%)' }} />
            </div>
        </div>
    );
};

export default Signup;
