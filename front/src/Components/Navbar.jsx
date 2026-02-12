import React from 'react';
import { Link } from 'react-router-dom';
import { SiRiotgames } from "react-icons/si";

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/profile' },
    ];

    return (
        <nav className="bg-black text-white px-6 py-4 shadow-lg border-b border-gray-800 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">

                {/* Left: Brand / Logo */}
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-red-600 text-3xl group-hover:scale-110 transition-transform duration-300">
                        <SiRiotgames />
                    </div>
                    <span className="text-xl font-bold tracking-wider uppercase group-hover:text-red-500 transition-colors">
                        Riot Games
                    </span>
                </Link>

                {/* Center: Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="relative text-gray-300 hover:text-white font-medium uppercase tracking-wide text-sm transition-colors py-2 group"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* Right: User Profile & Actions */}
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-bold transition-colors">
                        LOGIN
                    </Link>
                    <Link to="/signup" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors">
                        PLAY NOW
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;