import React, { useRef, useState, useEffect } from 'react';
import { TiLocationArrow, TiThMenu, TiTimes, TiArrowBack } from 'react-icons/ti';
import Button from './Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const navItems = ['Home', 'Games', 'News', 'Esport', 'About', 'Contact', 'Profile'];

const Navbar = () => {

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const audioElementRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate(-1)}
              className="lg:hidden text-white p-1 hover:text-red-500 transition-colors"
              aria-label="Go Back"
            >
              <TiArrowBack size={24} />
            </button>
          )}
          <div className="flex items-center gap-7">
            <Link to="/">
              <img src="/img/logo.jpg" alt="logo" className="w-10 rounded-full" />
            </Link>
            <Button
              id="product-button"
              title="Riot Games"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 lg:flex hidden items-center justify-center gap-1"
            />
          </div>


          <div className="flex h-full items-center">
            <div className="hidden lg:block">
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
                } else if (item === 'Home') {
                  return (
                    <Link
                      key={index}
                      to="/"
                      className="nav-hover-btn px-4 text-white hover:text-red-500 transition-colors"
                    >
                      {item}
                    </Link>
                  )
                } else if (item === 'Games') {
                  return (
                    <div key={index} className="relative group inline-flex items-center h-full align-middle">
                      <button className="nav-hover-btn px-4 text-white hover:text-red-500 transition-colors uppercase cursor-pointer h-full flex items-center">
                        {item}
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute top-[80%] left-1/2 -translate-x-1/2 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-md shadow-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pt-2 pb-2 z-[60]">
                        <Link
                          to="/games/valorant"
                          className="block px-4 py-3 text-sm text-white/80 hover:text-[#ff4655] hover:bg-white/5 transition-colors font-bold uppercase tracking-wider text-center"
                        >
                          Valorant
                        </Link>
                        <Link
                          to="/games/league-of-legends"
                          className="block px-4 py-3 text-sm text-white/80 hover:text-[#c89b3c] hover:bg-white/5 transition-colors font-bold uppercase tracking-wider text-center"
                        >
                          League of Legends
                        </Link>
                      </div>
                    </div>
                  )
                } else if (item === 'Esport') {
                  return (
                    <Link
                      key={index}
                      to="/esport"
                      className="nav-hover-btn px-4 text-white hover:text-red-500 transition-colors"
                    >
                      {item}
                    </Link>
                  )
                } else if (item === 'Profile') {
                  if (!isLoggedIn) return null;
                  return (
                    <Link
                      key={index}
                      to="/profile"
                      className="nav-hover-btn px-4 text-white hover:text-red-500 transition-colors"
                    >
                      {item}
                    </Link>
                  )
                } else if (item === 'About') {
                  return (
                    <Link
                      key={index}
                      to="/about"
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
              className="ml-5 flex items-center space-x-0.5"
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

            <button
              className="lg:hidden text-white ml-5 p-2 z-50 relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <TiTimes size={28} /> : <TiThMenu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {navItems.map((item, index) => {
          const commonClasses = "text-3xl font-black uppercase text-white hover:text-blue-500 transition-colors tracking-tighter";
          const handleClick = () => setIsMobileMenuOpen(false);

          if (item === 'News') {
            return <Link key={index} to="/news" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'Home') {
            return <Link key={index} to="/" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'Games') {
            return (
              <div key={index} className="flex flex-col items-center gap-4 w-full">
                <span className={`${commonClasses} text-white/50 cursor-default`}>{item}</span>
                <Link to="/games/valorant" className="text-2xl font-black uppercase text-white hover:text-[#ff4655] transition-colors tracking-tighter" onClick={handleClick}>Valorant</Link>
                <Link to="/games/league-of-legends" className="text-2xl font-black uppercase text-white hover:text-[#c89b3c] transition-colors tracking-tighter" onClick={handleClick}>League of Legends</Link>
              </div>
            )
          } else if (item === 'Esport') {
            return <Link key={index} to="/esport" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'About') {
            return <Link key={index} to="/about" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'Profile') {
            if (!isLoggedIn) return null;
            return <Link key={index} to="/profile" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else {
            return <a key={index} href={`#${item.toLowerCase()}`} className={commonClasses} onClick={handleClick}>{item}</a>
          }
        })}

        {isLoggedIn ? (
          <button
            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
            className="mt-8 px-8 py-3 bg-red-600 text-white font-bold rounded-full uppercase tracking-wider hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-full uppercase tracking-wider hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        )}
      </div>

    </div>
  );
};

export default Navbar;
