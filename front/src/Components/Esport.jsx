import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Footer from './Footer';

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
    return { color: '#ef4444', label: 'LIVE', isLive: true };
  if (s === 'unstarted' || s === 'upcoming')
    return { color: '#06b6d4', label: 'UPCOMING', isLive: false };
  return { color: '#10b981', label: 'COMPLETED', isLive: false };
};

const MatchCard = ({ match, index }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    gsap.to(cardRef.current, {
      rotateY: x, rotateX: y,
      duration: 0.4, ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0, rotateX: 0,
      duration: 0.6, ease: 'elastic.out(1, 0.5)',
    });
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
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top bar: league + status */}
      <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] truncate max-w-[55%]">
          {league}
        </span>
        <div className="flex items-center gap-2">
          {status.isLive && (
            <span className="esport-live-dot" />
          )}
          <span
            className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md"
            style={{
              color: status.color,
              backgroundColor: `${status.color}15`,
              border: `1px solid ${status.color}30`,
            }}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Team 1 */}
      <div className={`flex items-center gap-4 mb-3 ${team1.has_won ? 'opacity-100' : 'opacity-60'}`}>
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', border: '1px solid rgba(255,255,255,0.08)' }}>
          {team1.logo ? (
            <img src={team1.logo} alt={team1.name} className="w-7 h-7 object-contain" />
          ) : (
            <span className="text-[10px] font-black text-gray-400 tracking-wider">{getInitials(team1.name, team1.code)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm uppercase tracking-wide truncate ${team1.has_won ? 'text-white' : 'text-gray-400'}`}>
            {team1.name || 'TBD'}
          </p>
          {team1.record && (
            <p className="text-[10px] text-gray-600 font-mono">{team1.record.wins}W – {team1.record.losses}L</p>
          )}
        </div>
        {team1.game_wins !== undefined && (
          <span className={`text-xl font-black tabular-nums ${team1.has_won ? 'text-white' : 'text-gray-600'}`}>
            {team1.game_wins}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-2 px-1">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
        <span className="text-[9px] font-black text-gray-700 tracking-widest">VS</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* Team 2 */}
      <div className={`flex items-center gap-4 mt-3 ${team2.has_won ? 'opacity-100' : 'opacity-60'}`}>
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', border: '1px solid rgba(255,255,255,0.08)' }}>
          {team2.logo ? (
            <img src={team2.logo} alt={team2.name} className="w-7 h-7 object-contain" />
          ) : (
            <span className="text-[10px] font-black text-gray-400 tracking-wider">{getInitials(team2.name, team2.code)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm uppercase tracking-wide truncate ${team2.has_won ? 'text-white' : 'text-gray-400'}`}>
            {team2.name || 'TBD'}
          </p>
          {team2.record && (
            <p className="text-[10px] text-gray-600 font-mono">{team2.record.wins}W – {team2.record.losses}L</p>
          )}
        </div>
        {team2.game_wins !== undefined && (
          <span className={`text-xl font-black tabular-nums ${team2.has_won ? 'text-white' : 'text-gray-600'}`}>
            {team2.game_wins}
          </span>
        )}
      </div>

      {/* Footer: date */}
      <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-[11px] text-gray-600 font-mono">{formatMatchDate(matchDate)}</span>
        <svg className="w-4 h-4 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

const Esport = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const matchGridRef = useRef(null);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRegion, setActiveRegion] = useState('');

  const fetchSchedule = useCallback(async (region = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = region
        ? `http://localhost:5000/api/esports/schedule?region=${region}`
        : 'http://localhost:5000/api/esports/schedule';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();

      let parsed = [];
      if (data?.data?.segments) parsed = data.data.segments;
      else if (data?.data && Array.isArray(data.data)) parsed = data.data;
      else if (Array.isArray(data)) parsed = data;

      setMatches(parsed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule(activeRegion);
  }, [activeRegion, fetchSchedule]);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out',
    })
      .from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')
      .from('.hero-video', {
        scale: 1.2,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
      }, '-=1');

    gsap.utils.toArray('.reveal-section').forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

  }, { scope: containerRef });

  useEffect(() => {
    if (!loading && matches.length > 0 && matchGridRef.current) {
      const cards = matchGridRef.current.querySelectorAll('.esport-match-card');
      gsap.fromTo(cards,
        { y: 40, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.06,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );
    }
  }, [loading, matches, activeRegion]);

  const handleRegionChange = (value) => {
    if (matchGridRef.current) {
      const cards = matchGridRef.current.querySelectorAll('.esport-match-card');
      gsap.to(cards, {
        y: -15, opacity: 0,
        stagger: 0.02,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setActiveRegion(value),
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
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden font-sans">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          src="/videos/esport-1.mp4"
          loop muted autoPlay
          className="hero-video absolute top-0 left-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

        <div className="relative z-20 text-center px-4">
          <h1 className="hero-title text-7xl md:text-9xl font-black uppercase tracking-tighter italic mb-4">
            Where Legends
          </h1>
          <h1 className="hero-title text-7xl md:text-9xl font-black uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Are Born
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl mt-8 font-light tracking-widest uppercase text-gray-300">
            The Next Generation of Competitive Gaming
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <div className="w-5 h-9 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-1.5 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ LIVE SCHEDULE ═══ */}
      <section className="reveal-section py-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section heading */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2 h-8 rounded-full bg-gradient-to-b from-red-500 to-red-600 block" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-400">
                  Live Schedule
                </span>
                {liveCount > 0 && (
                  <span className="ml-2 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full">
                    <span className="esport-live-dot" />
                    {liveCount} LIVE
                  </span>
                )}
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-none">
                Upcoming <span className="text-red-500">Matches</span>
              </h2>
            </div>

            {/* Region filter */}
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

          {/* Error */}
          {error && (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <p className="text-white font-bold text-lg mb-1">Couldn't Load Matches</p>
              <p className="text-gray-500 text-sm mb-6">{error}</p>
              <button
                onClick={() => fetchSchedule(activeRegion)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="esport-match-card animate-pulse">
                  <div className="flex justify-between mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="h-3 w-28 bg-white/5 rounded" />
                    <div className="h-5 w-16 bg-white/5 rounded" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-11 h-11 bg-white/5 rounded-lg" />
                    <div className="h-3 w-24 bg-white/5 rounded" />
                  </div>
                  <div className="h-px bg-white/[0.03] my-3" />
                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-11 h-11 bg-white/5 rounded-lg" />
                    <div className="h-3 w-20 bg-white/5 rounded" />
                  </div>
                  <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="h-3 w-32 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && matches.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <p className="text-white font-bold text-lg mb-1">No Matches Scheduled</p>
              <p className="text-gray-500 text-sm">Try a different region or check back later.</p>
            </div>
          )}

          {/* Match grid */}
          {!loading && !error && matches.length > 0 && (
            <div ref={matchGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.slice(0, 15).map((match, i) => (
                <MatchCard key={match.match?.id || i} match={match} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ FEATURED VIDEO ═══ */}
      <section className="reveal-section py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-black uppercase mb-6 leading-tight">
              Dominate <span className="text-blue-500">The Arena</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Experience the thrill of high-stakes competition. From local qualifiers to the world stage, every match writes a new chapter in esports history. Join millions of fans witnessing the evolution of tactical gameplay.
            </p>
            <button className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm">
              Watch Live
            </button>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/20 group">
            <video
              src="/videos/feature-1.mp4"
              loop muted autoPlay
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="reveal-section relative py-32 flex items-center justify-center overflow-hidden">
        <video
          src="/videos/feature-3.mp4"
          loop muted autoPlay
          className="absolute inset-0 w-full h-full object-cover opacity-20 hover:opacity-30 transition-opacity duration-700 scale-110"
        />
        <div className="relative z-10 text-center px-4">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic mb-8">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Compete?</span>
          </h2>
          <button className="bg-red-600 text-white font-bold py-4 px-12 rounded-none hover:bg-red-700 transition-all uppercase tracking-widest text-lg skew-x-[-10deg] hover:skew-x-[-20deg] border-2 border-transparent hover:border-white">
            <span className="block skew-x-[10deg] hover:skew-x-[20deg]">Register Team</span>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Esport;
