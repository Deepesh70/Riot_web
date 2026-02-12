import React, { useRef, useState } from 'react';
import { TiLocationArrow } from 'react-icons/ti';
import Button from './Button';
// import { useWindowScroll } from 'react-use';
import { useEffect } from 'react';
// import gsap from 'gsap';

import { Link, useNavigate } from 'react-router-dom';

const navItems = ['Drift', 'Vault', 'Prolugue', 'About', 'Contact'];

const Navbar = () => {
  // Simple state for audio toggle
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const audioElementRef = useRef(null);
  const navigate = useNavigate();

  const toggleAudio = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  }

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);


  // Check login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
    // window.location.reload(); // No longer needed with navigate and state update, but state update might not reflect immediately across components without context. 
    // Actually, simply navigating to login is enough, as login page doesn't check for token to redirect away usually (unless we added that).
    // But to be safe and clear state, a reload or context update is best. 
    // For now, navigate('/login') is the request. The user asked "on logout it should redirect to login page".
    // I will use navigate.
  };

  return (
    <div className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6">
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4 bg-black/50 backdrop-blur-md rounded-lg">
          {/* Logo Section */}
          <div className="flex items-center gap-7">
            <img src="/img/logo.jpg" alt="logo" className="w-10 rounded-full" />
            <Button
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn px-4 text-white hover:text-blue-200 transition-colors"
                >
                  {item}
                </a>
              ))}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="nav-hover-btn px-4 text-white hover:text-red-400 transition-colors font-bold cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="nav-hover-btn px-4 text-white hover:text-blue-200 transition-colors font-bold"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Simplified Audio Button */}
            <button
              onClick={toggleAudio}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`indicator-line ${isIndicatorActive ? 'active' : ''}`}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                    height: isIndicatorActive ? '16px' : '4px', // simplified animation logic
                    width: '4px',
                    backgroundColor: 'white',
                    borderRadius: '999px',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
