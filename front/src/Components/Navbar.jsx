import React from 'react';
import { SiRiotgames } from "react-icons/si";
import { BiUserCircle } from "react-icons/bi";
import { FaGamepad } from "react-icons/fa";

const Navbar = () => {
    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Dashboard', href: '#' },
        { name: 'Games', href: '#' },
        { name: 'News', href: '#' },
    ];

    return (
        <nav className="bg-black text-white px-6 py-4 shadow-lg border-b border-gray-800">
            <div className="container mx-auto flex items-center justify-between">

                {/* Left: Brand / Logo */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-red-600 text-3xl group-hover:scale-110 transition-transform duration-300">
                        <SiRiotgames />
                    </div>
                    <span className="text-xl font-bold tracking-wider uppercase group-hover:text-red-500 transition-colors">
                        Riot Games
                    </span>
                </div>

                {/* Center: Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="relative text-gray-300 hover:text-white font-medium uppercase tracking-wide text-sm transition-colors py-2 group"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}
                </div>

                {/* Right: User Profile & Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all">
                        <FaGamepad size={20} />
                    </button>

                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-gray-700">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold leading-none">Summoner</p>
                            <p className="text-xs text-gray-500">Online</p>
                        </div>
                        <BiUserCircle className="text-3xl text-gray-300" />
                    </div>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;