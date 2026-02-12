import React, { useRef, useState, useEffect } from 'react';
import { TiLocationArrow } from 'react-icons/ti';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';

const navItems = ['Drift', 'Vault', 'News', 'About', 'Contact'];

const Navbar = () => {

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
      if (audioElementRef.current) audioElementRef.current.play();
    } else {
      if (audioElementRef.current) audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);



  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6">
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4 bg-black/50 backdrop-blur-md rounded-lg">

          <div className="flex items-center gap-7">
            <img src="/img/logo.jpg" alt="logo" className="w-10 rounded-full" />
            <Button
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>


          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => {
                if (item === 'News') {
                  return (
                    <Link
                      key={index}
                      to="/news"
                      className="nav-hover-btn px-4 text-white hover:text-red-500 transition-colors"
                    >
                      {item}
                    </Link>
                  )
                } else if (item === 'Drift') {
                  return (
                    <Link
                      key={index}
                      to="/"
                      className="nav-hover-btn px-4 text-white hover:text-red-500 transition-colors"
                    >
                      {item}
                    </Link>
                  )
                } else {
                  return (
                    <a
                      key={index}
                      href={`#${item.toLowerCase()}`}
                      className="nav-hover-btn px-4 text-white hover:text-red-500 transition-colors"
                    >
                      {item}
                    </a>
                  )
                }
              })}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="nav-hover-btn px-4 text-white hover:text-red-500 transition-colors font-bold cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="nav-hover-btn px-4 text-white hover:text-red-500 transition-colors font-bold"
                >
                  Login
                </Link>
              )}
            </div>


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
