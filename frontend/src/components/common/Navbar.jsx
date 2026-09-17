import React, { useRef, useState, useEffect } from 'react';
import { TiLocationArrow, TiThMenu, TiTimes, TiArrowBack } from 'react-icons/ti';
import { SiValorant, SiLeagueoflegends } from 'react-icons/si';
import Button from './Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../context/AuthContext';

const navItems = ['Home', 'Games', 'News', 'Esport', 'Smurf Detector', 'About', 'Profile'];

const Navbar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const audioElementRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const toggleAudio = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      if (audioElementRef.current) audioElementRef.current.play();
    } else {
      if (audioElementRef.current) audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show near the top
      if (currentScrollY < 40) {
        setIsNavVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // If mobile menu is open, do not hide navbar
      if (isMobileMenuOpen) {
        setIsNavVisible(true);
        return;
      }

      // Scrolling Down -> Hide Navbar
      if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 5) {
        setIsNavVisible(false);
      } 
      // Scrolling Up -> Show Navbar
      else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 5) {
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={`fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-500 ease-in-out sm:inset-x-6 ${
        isNavVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
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
                    <DropdownMenu key={index} modal={false}>
                      <DropdownMenuTrigger asChild>
                        <button className={`${navClass} outline-none cursor-pointer inline-flex items-center gap-1.5 group data-[state=open]:text-white`}>
                          <span>{item}</span>
                          <svg
                            className="w-3 h-3 text-white/50 transition-transform duration-300 group-hover:text-white group-data-[state=open]:rotate-180 group-data-[state=open]:text-accent-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-80 bg-[#0c0d12]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(79,183,221,0.08)] p-2 relative overflow-hidden animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                        sideOffset={14}
                      >
                        {/* Top subtle cyan neon accent line */}
                        <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent pointer-events-none" />

                        {/* Category Header */}
                        <div className="px-3 pt-2 pb-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-general">
                            Riot Universe
                          </span>
                          <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">
                            Featured Games
                          </span>
                        </div>

                        <div className="h-px bg-white/5 my-1" />

                        {/* Valorant Item */}
                        <DropdownMenuItem asChild className="p-0 focus:bg-transparent outline-none cursor-pointer">
                          <Link
                            to="/games/valorant"
                            className="group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-red-500/15 hover:to-transparent border border-transparent hover:border-red-500/25"
                          >
                            <div className="size-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#FF4655] group-hover:bg-[#FF4655] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(255,70,85,0.4)] transition-all duration-300 shrink-0">
                              <SiValorant className="size-5" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-general font-bold text-sm text-white group-hover:text-white transition-colors tracking-wide truncate">
                                  VALORANT
                                </span>
                                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 leading-none shrink-0">
                                  FPS
                                </span>
                              </div>
                              <span className="text-[11px] text-white/40 group-hover:text-white/70 transition-colors truncate">
                                Tactical Character Shooter
                              </span>
                            </div>
                            <svg
                              className="w-4 h-4 text-white/20 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300 shrink-0 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </DropdownMenuItem>

                        {/* League of Legends Item */}
                        <DropdownMenuItem asChild className="p-0 focus:bg-transparent outline-none cursor-pointer">
                          <Link
                            to="/games/league-of-legends"
                            className="group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-transparent border border-transparent hover:border-amber-500/25 mt-1"
                          >
                            <div className="size-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#c89b3c] group-hover:bg-[#c89b3c] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all duration-300 shrink-0">
                              <SiLeagueoflegends className="size-5" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-general font-bold text-sm text-white group-hover:text-white transition-colors tracking-wide whitespace-nowrap">
                                  LEAGUE OF LEGENDS
                                </span>
                                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 leading-none shrink-0">
                                  MOBA
                                </span>
                              </div>
                              <span className="text-[11px] text-white/40 group-hover:text-white/70 transition-colors truncate">
                                Team-Based Strategy
                              </span>
                            </div>
                            <svg
                              className="w-4 h-4 text-white/20 group-hover:text-[#c89b3c] group-hover:translate-x-1 transition-all duration-300 shrink-0 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
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
                  if (!isAuthenticated) return null;
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
              {isAuthenticated ? (
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
            className="flex items-center gap-2 text-3xl font-black uppercase text-white hover:text-accent-primary transition-colors tracking-tighter"
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
              <div key={index} className="flex flex-col items-center gap-3 w-full px-6">
                <span className={`${commonClasses} text-white/50 cursor-default text-xl tracking-widest`}>{item}</span>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <Link
                    to="/games/valorant"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-all duration-300 group"
                    onClick={handleClick}
                  >
                    <div className="size-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-[#FF4655] shrink-0">
                      <SiValorant className="size-4" />
                    </div>
                    <div className="flex flex-col text-left flex-1">
                      <span className="text-base font-bold uppercase text-white group-hover:text-red-400 transition-colors font-general tracking-wide">
                        Valorant
                      </span>
                      <span className="text-[10px] text-white/40">Tactical Shooter</span>
                    </div>
                  </Link>
                  <Link
                    to="/games/league-of-legends"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 transition-all duration-300 group"
                    onClick={handleClick}
                  >
                    <div className="size-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#c89b3c] shrink-0">
                      <SiLeagueoflegends className="size-4" />
                    </div>
                    <div className="flex flex-col text-left flex-1">
                      <span className="text-base font-bold uppercase text-white group-hover:text-amber-300 transition-colors font-general tracking-wide">
                        League of Legends
                      </span>
                      <span className="text-[10px] text-white/40">Strategy MOBA</span>
                    </div>
                  </Link>
                </div>
              </div>
            )
          } else if (item === 'Esport') {
            return <Link key={index} to="/esport" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'About') {
            return <Link key={index} to="/about" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'Profile') {
            if (!isAuthenticated) return null;
            return <Link key={index} to="/profile" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else if (item === 'Smurf Detector') {
            return <Link key={index} to="/smurf-detector" className={commonClasses} onClick={handleClick}>{item}</Link>
          } else {
            return <a key={index} href={`#${item.toLowerCase()}`} className={commonClasses} onClick={handleClick}>{item}</a>
          }
        })}

        {isAuthenticated ? (
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
