import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AutoPlayVideo from '../components/common/AutoPlayVideo';

gsap.registerPlugin(ScrollTrigger);

const REGIONS = [
  { label: 'All Regions', value: '' },
  { label: 'International', value: 'international' },
  { label: 'North America', value: 'north_america' },
  { label: 'EMEA', value: 'emea' },
  { label: 'Korea', value: 'korea' },
  { label: 'Brazil', value: 'brazil' },
  { label: 'Japan', value: 'japan' },
  { label: 'Southeast Asia', value: 'southeast_asia' },
];

const formatMatchDate = (dateStr) => {
  if (!dateStr) return 'Date TBD';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getMatchStatus = (state) => {
  if (!state) return { color: '#6b7280', label: 'TBD', isLive: false };
  const s = state.toLowerCase();
  if (s === 'live' || s === 'inprogress' || s === 'running')
    return { color: '#4FB7DD', label: 'LIVE', isLive: true };
  if (s === 'unstarted' || s === 'upcoming')
    return { color: '#38bdf8', label: 'UPCOMING', isLive: false };
  return { color: '#EDFF66', label: 'COMPLETED', isLive: false };
};

const MatchCard = ({ match }) => {
  const cardRef = useRef(null);
  const rotateXToRef = useRef(null);
  const rotateYToRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    rotateXToRef.current = gsap.quickTo(card, 'rotateX', { duration: 0.22, ease: 'power2.out' });
    rotateYToRef.current = gsap.quickTo(card, 'rotateY', { duration: 0.22, ease: 'power2.out' });
    return () => {
      rotateXToRef.current = null;
      rotateYToRef.current = null;
      gsap.killTweensOf(card);
      gsap.set(card, { clearProps: 'transform' });
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !rotateXToRef.current || !rotateYToRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    rotateXToRef.current(y);
    rotateYToRef.current(x);
  };

  const handleMouseLeave = () => {
    rotateXToRef.current?.(0);
    rotateYToRef.current?.(0);
  };

  const teams = match.match?.teams || [];
  const team1 = teams[0] || {};
  const team2 = teams[1] || {};
  const status = getMatchStatus(match.state);
  const league = match.league?.name || match.tournament?.name || 'Valorant Esports';
  const matchDate = match.date || match.match?.date;
  const getInitials = (name, code) => (code || (name || '??').slice(0, 3)).toUpperCase();

  return (
    <div
      ref={cardRef}
      className="esport-match-card group"
      style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-white/[0.04]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 truncate">
          {league}
        </span>
        <span
          className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1.5 shrink-0"
          style={{
            color: status.color,
            background: `${status.color}15`,
            border: `1px solid ${status.color}30`,
          }}
        >
          {status.isLive && <span className="esport-live-dot" />}
          {status.label}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md border border-white/5"
            style={{ background: 'linear-gradient(135deg, rgba(79,183,221,0.2), rgba(255,255,255,0.03))' }}
          >
            {team1.image ? (
              <img src={team1.image} alt={team1.name} className="w-6 h-6 object-contain" />
            ) : (
              getInitials(team1.name, team1.code)
            )}
          </div>
          <span className="text-sm font-bold text-white truncate">{team1.name || 'TBD'}</span>
        </div>
        {team1.result && (
          <span className={`text-sm font-mono font-bold ${team1.result.gameWins > (team2.result?.gameWins || 0) ? 'text-accent-primary' : 'text-white/40'}`}>
            {team1.result.gameWins ?? '-'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 my-1">
        <div className="h-px bg-white/[0.04] flex-1" />
        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">VS</span>
        <div className="h-px bg-white/[0.04] flex-1" />
      </div>

      <div className="flex items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md border border-white/5"
            style={{ background: 'linear-gradient(135deg, rgba(87,36,255,0.2), rgba(255,255,255,0.03))' }}
          >
            {team2.image ? (
              <img src={team2.image} alt={team2.name} className="w-6 h-6 object-contain" />
            ) : (
              getInitials(team2.name, team2.code)
            )}
          </div>
          <span className="text-sm font-bold text-white truncate">{team2.name || 'TBD'}</span>
        </div>
        {team2.result && (
          <span className={`text-sm font-mono font-bold ${team2.result.gameWins > (team1.result?.gameWins || 0) ? 'text-accent-primary' : 'text-white/40'}`}>
            {team2.result.gameWins ?? '-'}
          </span>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-white/30">
        <span className="font-mono">{formatMatchDate(matchDate)}</span>
        <span className="text-[10px] uppercase tracking-wider text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">
          View Match →
        </span>
      </div>
    </div>
  );
};

const Esport = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRegion, setActiveRegion] = useState('');
  const containerRef = useRef(null);
  const matchGridRef = useRef(null);
  const prevMatchesCount = useRef(0);

  const fetchSchedule = useCallback(async (region = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = region
        ? `${import.meta.env.VITE_API_BASE_URL}/api/esports/schedule?region=${region}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/esports/schedule`;
      const res = await fetch(url);
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Esports live schedule service is currently offline or unreachable.');
      }
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Esports live data feed is temporarily unavailable.');
      }

      let parsed = [];
      if (data?.data && Array.isArray(data.data)) parsed = data.data;
      else if (data?.data?.segments) parsed = data.data.segments;
      else if (Array.isArray(data)) parsed = data;

      setMatches(parsed);
    } catch (err) {
      console.warn('Fetch schedule notice:', err.message);
      if (err.message.includes('JSON') || err.message.includes('doctype') || err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Esports live schedule service is currently offline. Please check back shortly or verify your connection.');
      } else if (err.message.includes('HENRIK_DEV_API_KEY') || err.message.includes('missing')) {
        setError('Esports live data feed is offline (API key is not configured on the server).');
      } else {
        setError(err.message || 'Esports live schedule is currently unavailable.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule(activeRegion);
  }, [activeRegion, fetchSchedule]);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-video', { scale: 1.15, opacity: 0, duration: 1.4 })
      .from('.hero-title', { y: 80, opacity: 0, duration: 1, stagger: 0.2 }, '-=0.8')
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5');

    gsap.utils.toArray('.reveal-section').forEach((section) => {
      gsap.fromTo(
        section,
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }
      );
    });
  }, { scope: containerRef });

  useEffect(() => {
    if (!loading && matches.length > 0 && matchGridRef.current) {
      const cards = matchGridRef.current.querySelectorAll('.esport-match-card');
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out' }
      );
      prevMatchesCount.current = matches.length;
    }
  }, [matches, loading]);

  const handleRegionChange = (value) => {
    if (matchGridRef.current && matches.length > 0) {
      const cards = matchGridRef.current.querySelectorAll('.esport-match-card');
      gsap.to(cards, {
        y: -15,
        opacity: 0,
        scale: 0.96,
        stagger: 0.03,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setActiveRegion(value);
        },
      });
    } else {
      setActiveRegion(value);
    }
  };

  const liveCount = matches.filter(m => {
    const s = m.state?.toLowerCase();
    return s === 'live' || s === 'inprogress' || s === 'running';
  }).length;

  return (
    <div ref={containerRef} className="min-h-screen bg-dark-900 text-white overflow-hidden font-sans">
      <Navbar />

      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <AutoPlayVideo
          src="/videos/esport-1.mp4"
          preload="auto"
          rootMargin="400px 0px"
          threshold={0.2}
          className="hero-video absolute top-0 left-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent z-10" />

        <div className="relative z-20 text-center px-4">
          <h1 className="hero-title text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tight leading-none mb-3 font-riot">
            Where Legends
          </h1>
          <h1 className="hero-title text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-blue-400 font-riot">
            Are Born
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl mt-8 font-light tracking-widest uppercase text-white/70">
            The Next Generation of Competitive Gaming
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <div className="w-5 h-9 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-1.5 bg-accent-primary rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      <section className="reveal-section py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2 h-8 rounded-full bg-gradient-to-b from-accent-primary to-blue-400 block" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-primary">
                  Live Schedule
                </span>
                {liveCount > 0 && (
                  <span className="ml-2 flex items-center gap-1.5 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full">
                    <span className="esport-live-dot" />
                    {liveCount} LIVE
                  </span>
                )}
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-none font-riot">
                Upcoming <span className="text-accent-primary">Matches</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleRegionChange(r.value)}
                  className={`esport-region-tab ${activeRegion === r.value ? 'active' : ''}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex flex-col items-center py-16 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center mb-5 shadow-lg">
                <svg className="w-7 h-7 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <p className="text-white font-bold text-lg mb-2 font-riot">Live Feed Unavailable</p>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">{error}</p>
              <button
                onClick={() => fetchSchedule(activeRegion)}
                className="bg-gradient-to-r from-accent-primary to-blue-400 text-black text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(79,183,221,0.3)]"
              >
                Retry Connection
              </button>
            </div>
          )}

          {!loading && !error && matches.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <p className="text-white font-bold text-lg mb-1">No Matches Scheduled</p>
              <p className="text-white/40 text-sm">Try a different region or check back later.</p>
            </div>
          )}

          {!loading && !error && matches.length > 0 && (
            <div ref={matchGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.slice(0, 15).map((match, i) => (
                <MatchCard key={match.match?.id || i} match={match} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="reveal-section py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-black uppercase mb-6 leading-tight font-riot">
              Dominate <span className="text-accent-primary">The Arena</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Experience the thrill of high-stakes competition. From local qualifiers to the world stage, every match writes a new chapter in esports history. Join millions of fans witnessing the evolution of tactical gameplay.
            </p>
            <button className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-white/90 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs cursor-pointer shadow-lg">
              Watch Live
            </button>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
            <AutoPlayVideo
              src="/videos/feature-1.mp4"
              preload="metadata"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
          </div>
        </div>
      </section>

      <section className="reveal-section relative py-32 flex items-center justify-center overflow-hidden">
        <AutoPlayVideo
          src="/videos/feature-3.mp4"
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-20 hover:opacity-30 transition-opacity duration-700 scale-110"
        />
        <div className="relative z-10 text-center px-4">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic mb-8 font-riot">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-blue-400">Compete?</span>
          </h2>
          <button className="bg-gradient-to-r from-accent-primary to-blue-400 text-black font-black py-4 px-12 rounded-full hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm cursor-pointer shadow-[0_0_30px_rgba(79,183,221,0.4)]">
            <span>Register Team</span>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Esport;
