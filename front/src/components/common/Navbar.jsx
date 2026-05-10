import React, { useRef, useState, useEffect } from 'react';
import { TiLocationArrow, TiThMenu, TiTimes, TiArrowBack } from 'react-icons/ti';
import Button from './Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const navItems = ['Home', 'Games', 'News', 'Esport', 'Smurf Detector', 'About', 'Profile'];

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
          <div className="flex items-center gap-7">
            <Link to="/">
              <img src="/img/logo.png" alt="logo" className="w-10 rounded-full" />
            </Link>
            <Button
              id="product-button"
              title="Riot Games"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 lg:flex hidden items-center justify-center gap-1"
            />
          </div>


          <div className="flex h-full items-center gap-4 md:gap-6">
            <div className="hidden lg:block">
              {navItems.map((item, index) => {
                const navClass = "nav-hover-btn px-4 text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium";
                if (item === 'News') {
                  return (
                    <Link
                      key={index}
                      to="/news"
                      className={navClass}
                    >
                      {item}
                    </Link>
                  )
                } else if (item === 'Home') {
                  return (
                    <Link
                      key={index}
                      to="/"
                      className={navClass}
                    >
                      {item}
                    </Link>
                  )
                } else if (item === 'Games') {
                  return (
                    <DropdownMenu key={index}>
                      <DropdownMenuTrigger asChild>
                        <button className={`${navClass} outline-none cursor-pointer`}>
                          {item}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-dark-900 text-white border border-white/10 rounded-lg shadow-xl" sideOffset={8}>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white font-medium transition-colors">
                          <Link to="/games/valorant" className="w-full">Valorant</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white font-medium transition-colors">
                          <Link to="/games/league-of-legends" className="w-full">League of Legends</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                } else if (item === 'Esport') {
                  return (
                    <Link
                      key={index}
                      to="/esport"
                      className={navClass}
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
                      className={navClass}
                    >
                      {item}
                    </Link>
                  )
                } else if (item === 'About') {
                  return (
                    <Link
                      key={index}
                      to="/about"
                      className={navClass}
                    >
                      {item}
                    </Link>
                  )
                } else if (item === 'Smurf Detector') {
                  return (
                    <Link
                      key={index}
                      to="/smurf-detector"
                      className={navClass}
                    >
                      {item}
                    </Link>
                  )
                } else {
                  return (
                    <a
                      key={index}
                      href={`#${item.toLowerCase()}`}
                      className={navClass}
                    >
                      {item}
                    </a>
                  )
                }
              })}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="nav-hover-btn px-4 text-white/80 hover:text-white transition-colors duration-300 font-medium text-sm cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="nav-hover-btn px-4 text-white/80 hover:text-white transition-colors duration-300 font-medium text-sm"
                >
                  Login
                </Link>
              )}
            </div>


            <button
              onClick={toggleAudio}
              className="flex items-center space-x-0.5"
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
              className="lg:hidden text-white p-2 z-50 relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <TiTimes size={28} /> : <TiThMenu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {location.pathname !== '/' && (
          <button
            onClick={() => { navigate(-1); setIsMobileMenuOpen(false); }}
            className="flex items-center gap-2 text-3xl font-black uppercase text-white hover:text-red-500 transition-colors tracking-tighter"
          >
            <TiArrowBack size={32} /> Back
          </button>
        )}
        {navItems.map((item, index) => {
          const commonClasses = "text-2xl sm:text-3xl font-black uppercase text-white hover:text-accent-primary transition-colors duration-300 tracking-normal sm:tracking-tighter";
          const handleClick = () => setIsMobileMenuOpen(false);

          if (item === 'News') {
            return <Link key={index} to="/news" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'Home') {
            return <Link key={index} to="/" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'Games') {
            return (
              <div key={index} className="flex flex-col items-center gap-4 w-full">
                <span className={`${commonClasses} text-white/50 cursor-default`}>{item}</span>
                <Link to="/games/valorant" className="text-2xl font-black uppercase text-white hover:text-accent-primary transition-colors duration-300 tracking-tighter" onClick={handleClick}>Valorant</Link>
                <Link to="/games/league-of-legends" className="text-2xl font-black uppercase text-white hover:text-accent-primary transition-colors duration-300 tracking-tighter" onClick={handleClick}>League of Legends</Link>
              </div>
            )
          } else if (item === 'Esport') {
            return <Link key={index} to="/esport" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'About') {
            return <Link key={index} to="/about" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'Profile') {
            if (!isLoggedIn) return null;
            return <Link key={index} to="/profile" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'Smurf Detector') {
            return <Link key={index} to="/smurf-detector" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else {
            return <a key={index} href={`#${item.toLowerCase()}`} className={commonClasses} onClick={handleClick}>{item}</a>
          }
        })}

        {isLoggedIn ? (
          <button
            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-accent-primary to-blue-400 text-black font-bold rounded-full uppercase tracking-wider hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-accent-primary to-blue-400 text-black font-bold rounded-full uppercase tracking-wider hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Login
          </Link>
        )}
      </div>

    </div>
  );
};

export default Navbar;
