import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiStarFullOutline } from 'react-icons/ti';
import { FaTrophy, FaGamepad, FaSearch, FaCrosshairs, FaShieldAlt } from 'react-icons/fa';
import { SiValorant, SiLeagueoflegends } from 'react-icons/si';

import Navbar from '../components/Navbar';

const UserProfile = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Core user state
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search state
    const [riotGameName, setRiotGameName] = useState('');
    const [riotTagLine, setRiotTagLine] = useState('');
    const [selectedGame, setSelectedGame] = useState('val');

    // Match data state
    const [activeTab, setActiveTab] = useState('valorant');
    const [valMatches, setValMatches] = useState([]);
    const [lolMatches, setLolMatches] = useState([]);
    const [matchesLoading, setMatchesLoading] = useState(false);
    const [lolFetched, setLolFetched] = useState(false);
    const [playerPuuid, setPlayerPuuid] = useState(null);
    const [persona, setPersona] = useState(null);

    // Decorative agents
    const [agents, setAgents] = useState([]);

    const API = import.meta.env.VITE_API_BASE_URL;

    // ─── Fetch decorative agents from Valorant API ───
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await fetch(`${API}/api/valorant/agents`);
                if (res.ok) {
                    const data = await res.json();
                    setAgents(data.data || []);
                }
            } catch (e) {
                console.error('Agent fetch failed', e);
            }
        };
        fetchAgents();
    }, []);

    // ─── Fetch profile + Valorant data on mount ───
    useEffect(() => {
        const fetchAll = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please login.');
                setLoading(false);
                return;
            }

            try {
                const profileRes = await fetch(`${API}/api/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                if (!profileRes.ok) throw new Error('Failed to fetch profile');
                const localData = await profileRes.json();
                let enriched = { ...localData };

                if (localData.riotGameName && localData.riotTagLine) {
                    setRiotGameName(localData.riotGameName);
                    setRiotTagLine(localData.riotTagLine);

                    try {
                        const valAccRes = await fetch(`${API}/api/users/riot/val/account/${encodeURIComponent(localData.riotGameName)}/${encodeURIComponent(localData.riotTagLine)}`);
                        if (valAccRes.ok) {
                            const valAcc = await valAccRes.json();
                            enriched = {
                                ...enriched,
                                level: valAcc.account_level,
                                region: valAcc.region?.toUpperCase() || 'VALORANT',
                                avatar: valAcc.card?.small,
                                coverWide: valAcc.card?.wide,
                                coverLarge: valAcc.card?.large,
                                displayName: valAcc.name,
                                tag: valAcc.tag,
                            };
                        }
                    } catch (e) { console.error('Valorant account fetch failed', e); }

                    try {
                        setMatchesLoading(true);
                        const valMatchRes = await fetch(`${API}/api/users/riot/matches/val/${encodeURIComponent(localData.riotGameName)}/${encodeURIComponent(localData.riotTagLine)}`);
                        if (valMatchRes.ok) {
                            const valData = await valMatchRes.json();
                            setValMatches(Array.isArray(valData) ? valData : []);
                        }
                    } catch (e) { console.error('Valorant matches fetch failed', e); }
                    finally { setMatchesLoading(false); }

                    try {
                        const playstyleRes = await fetch(`${API}/api/users/riot/val/playstyle/${encodeURIComponent(localData.riotGameName)}/${encodeURIComponent(localData.riotTagLine)}`);
                        if (playstyleRes.ok) {
                            const playstyleData = await playstyleRes.json();
                            setPersona(playstyleData.persona);
                        }
                    } catch (e) { console.error('Playstyle fetch failed', e); }

                    try {
                        const riotAccRes = await fetch(`${API}/api/users/riot/account/${encodeURIComponent(localData.riotGameName)}/${encodeURIComponent(localData.riotTagLine)}`);
                        if (riotAccRes.ok) {
                            const riotAcc = await riotAccRes.json();
                            setPlayerPuuid(riotAcc.puuid);
                        }
                    } catch (e) { console.error('Riot account fetch failed', e); }
                }

                setUserData(enriched);
            } catch (err) { setError(err.message); }
            finally { setLoading(false); }
        };
        fetchAll();
    }, []);

    // ─── Lazy fetch LoL matches ───
    const fetchLolMatches = useCallback(async () => {
        if (lolFetched || !playerPuuid) return;
        setMatchesLoading(true);
        try {
            const res = await fetch(`${API}/api/users/riot/matches/lol/${playerPuuid}`);
            if (res.ok) {
                const data = await res.json();
                setLolMatches(Array.isArray(data) ? data : []);
            }
        } catch (e) { console.error('LoL matches fetch failed', e); }
        finally { setMatchesLoading(false); setLolFetched(true); }
    }, [playerPuuid, lolFetched, API]);

    useEffect(() => {
        if (activeTab === 'lol') fetchLolMatches();
    }, [activeTab, fetchLolMatches]);

    // ─── Search ───
    const handleSearch = () => {
        if (!riotGameName || !riotTagLine) return alert('Please enter both Game Name and Tag Line');
        navigate(`/player/${selectedGame}/${riotGameName}/${riotTagLine}`);
    };

    // ─── Derived data ───
    const user = userData ? {
        username: userData.displayName || userData.name || 'Player',
        tag: userData.tag ? '#' + userData.tag : '#0000',
        level: userData.level || 1,
        region: userData.region || 'VALORANT',
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=1a1a2e&color=fff&size=128`,
        coverWide: userData.coverWide || null,
        coverLarge: userData.coverLarge || null,
    } : null;

    // Pick random decorative agents
    const decorAgents = agents.length > 3 ? [agents[2], agents[5], agents[8]] : agents.slice(0, 3);



    // ─── Loading ───
    if (loading) {
        return (
            <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center">
                <div className="three-body"><div className="three-body__dot"></div><div className="three-body__dot"></div><div className="three-body__dot"></div></div>
                <p className="text-neutral-500 text-xs uppercase tracking-[0.3em] mt-6 font-bold">Loading Profile</p>
            </div>
        );
    }

    if (error) {
        return (
            <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-4">
                <p className="text-red-500 font-bold text-xl">{error}</p>
                <a href="/login" className="px-8 py-3 bg-[#ff4655] text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#e83e4d] transition-all">Go to Login</a>
            </div>
        );
    }

    if (!user) return <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white" />;

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white font-sans relative overflow-hidden">
            <Navbar />

            {/* ═══════ CINEMATIC BACKGROUND ═══════ */}
            <div className="fixed inset-0 z-0">
                {/* Full-page HQ Valorant Background */}
                <img src="/img/gallery-2.jpg" alt="" className="profile-bg-video absolute inset-0 w-full h-full object-cover opacity-[0.1]" />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
                {/* Red radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]" style={{ background: 'radial-gradient(ellipse, rgba(255,70,85,0.08) 0%, transparent 70%)' }}></div>
                {/* Blue radial glow (bottom) */}
                <div className="absolute bottom-0 right-0 w-[600px] h-[500px]" style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)' }}></div>
            </div>

            {/* ═══════ FLOATING PARTICLES ═══════ */}
            <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="floating-particle absolute rounded-full"
                        style={{
                            width: `${2 + Math.random() * 3}px`,
                            height: `${2 + Math.random() * 3}px`,
                            background: i % 2 === 0 ? 'rgba(255,70,85,0.4)' : 'rgba(59,130,246,0.3)',
                            top: `${10 + Math.random() * 80}%`,
                            left: `${5 + Math.random() * 90}%`,
                            boxShadow: i % 2 === 0 ? '0 0 10px rgba(255,70,85,0.3)' : '0 0 10px rgba(59,130,246,0.2)',
                        }}
                    ></div>
                ))}
            </div>

            {/* ═══════ DECORATIVE AGENT PORTRAITS ═══════ */}
            <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden">
                {decorAgents[0]?.fullPortrait && (
                    <img src={decorAgents[0].fullPortrait} alt="" className="deco-agent deco-agent-1 absolute -bottom-20 -left-16 h-[55vh] opacity-[0.06] hidden lg:block" />
                )}
                {decorAgents[1]?.fullPortrait && (
                    <img src={decorAgents[1].fullPortrait} alt="" className="deco-agent deco-agent-2 absolute -bottom-10 -right-10 h-[50vh] opacity-[0.05] hidden lg:block" style={{ transform: 'scaleX(-1)' }} />
                )}
                {decorAgents[2]?.fullPortrait && (
                    <img src={decorAgents[2].fullPortrait} alt="" className="deco-agent deco-agent-3 absolute top-20 right-[15%] h-[30vh] opacity-[0.04] hidden xl:block" />
                )}
            </div>

            <div className="relative z-10 pt-24">

                {/* ═══════ HERO SECTION ═══════ */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-12">
                    <p className="profile-hero-subtitle text-xs uppercase tracking-[0.4em] text-red-500/60 font-bold mb-4">Player HQ</p>
                    <h1 className="profile-hero-title font-riot text-5xl sm:text-6xl md:text-8xl font-black uppercase leading-[0.9] mb-3"
                        style={{ background: 'linear-gradient(180deg, #fff 20%, #ff4655 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {user.username}
                    </h1>
                    <p className="profile-hero-subtitle text-neutral-500 text-sm font-mono tracking-wider">{user.tag} • {user.region}</p>
                </div>

                {/* ═══════ PROFILE CARD ═══════ */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
                    <div className="profile-avatar-section relative overflow-hidden rounded-2xl border border-white/[0.06]" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))' }}>
                        {/* Banner */}
                        {user.coverWide ? (
                            <div className="h-44 sm:h-56 overflow-hidden relative profile-banner-container">
                                <img src={user.coverWide} alt="Banner" className="profile-banner-img w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/50 to-transparent"></div>
                            </div>
                        ) : (
                            <div className="h-44 sm:h-56 relative" style={{ background: 'linear-gradient(135deg, #1a1030, #0f1923, #1a0a0a)' }}>
                                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,70,85,0.15), transparent 60%)' }}></div>
                            </div>
                        )}

                        {/* Profile info overlay */}
                        <div className="px-6 sm:px-8 pb-6 -mt-14 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 relative z-10">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl p-[3px] profile-avatar-ring shadow-xl" style={{ background: 'linear-gradient(135deg, #ff4655, #ff8a65, #ff4655)' }}>
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-[10px] object-cover border-[3px] border-[#0a0a0a]" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-black text-[10px] px-2 py-1 rounded-lg border-2 border-[#0a0a0a] flex items-center gap-0.5 shadow-lg">
                                    <TiStarFullOutline /> LVL {user.level}
                                </div>
                            </div>

                            {/* Name block */}
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none">
                                    {user.username}
                                    <span className="text-neutral-500 text-base ml-2 font-medium normal-case">{user.tag}</span>
                                </h2>
                                <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start">
                                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400/80">
                                        <FaCrosshairs className="text-[10px]" /> {user.region}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-yellow-500/80">
                                        <FaShieldAlt className="text-[10px]" /> Level {user.level}
                                    </span>
                                </div>
                            </div>


                            {/* Quick stats badges & Persona */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-3">
                                {persona && (
                                    <div className="profile-persona-card flex items-center gap-3 px-5 py-3 rounded-xl border border-white/[0.1] backdrop-blur-md shadow-2xl transition-transform hover:scale-105" 
                                         style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${persona.color}30)` }}>
                                         <div className="w-10 h-10 rounded-full flex items-center justify-center border shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
                                              style={{ borderColor: persona.color, backgroundColor: `${persona.color}40`, color: persona.color, boxShadow: `0 0 15px ${persona.color}40` }}>
                                            <FaGamepad size={18} />
                                         </div>

                                         <div className="text-left w-max">
                                             <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: persona.color }}>ML Persona Engine</p>
                                             <p className="text-sm font-black uppercase tracking-tight text-white">{persona.title}</p>
                                             <p className="text-[10px] text-neutral-300 max-w-[150px] leading-tight mt-0.5">{persona.description}</p>
                                         </div>
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <div className="profile-info-card text-center px-5 py-3 rounded-xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <p className="text-2xl font-black text-white">{valMatches.length}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Matches</p>
                                    </div>
                                    <div className="profile-info-card text-center px-5 py-3 rounded-xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <p className="text-2xl font-black text-green-400">{valMatches.filter(m => m.mmr_change_to_last_game > 0).length}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Wins</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════ SEARCH BAR ═══════ */}
                <div className="profile-search-section max-w-6xl mx-auto px-4 sm:px-6 mb-10">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="flex-1 flex items-center profile-search-wrapper rounded-xl overflow-hidden border border-white/[0.06] transition-all" style={{ background: 'rgba(255,255,255,0.025)' }}>
                            <div className="flex items-center gap-1 px-4 text-neutral-600">
                                <FaSearch className="text-sm" />
                            </div>
                            <input type="text" placeholder="Game Name" value={riotGameName} onChange={(e) => setRiotGameName(e.target.value)}
                                className="bg-transparent text-white px-2 py-3 outline-none flex-1 min-w-0 placeholder-neutral-600 text-sm" />
                            <div className="w-px h-6 bg-white/10"></div>
                            <input type="text" placeholder="#TAG" value={riotTagLine} onChange={(e) => setRiotTagLine(e.target.value)}
                                className="bg-transparent text-white px-3 py-3 outline-none w-24 placeholder-neutral-600 text-sm font-mono" />
                            <div className="w-px h-6 bg-white/10"></div>
                            <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}
                                className="bg-transparent text-neutral-400 px-3 py-3 outline-none cursor-pointer text-sm font-bold uppercase hover:text-white transition-colors">
                                <option value="val" className="bg-neutral-900">Valorant</option>
                                <option value="lol" className="bg-neutral-900">LoL</option>
                            </select>
                        </div>
                        <button onClick={handleSearch}
                            className="profile-search-btn bg-[#ff4655] hover:bg-[#e83e4d] text-white font-bold py-3 px-8 rounded-xl transition-all text-xs uppercase tracking-widest shadow-lg hover:shadow-[0_0_25px_rgba(255,70,85,0.3)] hover:translate-y-[-1px]">
                            Search Player
                        </button>
                    </div>
                </div>

                {/* ═══════ MATCH HISTORY ═══════ */}
                <div className="profile-matches-section max-w-6xl mx-auto px-4 sm:px-6 pb-24">
                    {/* Section title */}
                    <div className="mb-8">
                        <h2 className="font-riot text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9]"
                            style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.4) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Match<br />History
                        </h2>
                        <p className="text-neutral-600 text-xs uppercase tracking-widest font-bold mt-2">Recent competitive performance</p>
                    </div>

                    <div className="profile-matches-container border border-white/[0.06] rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))' }}>
                        {/* Tabs */}
                        <div className="flex items-center border-b border-white/[0.06] px-6 pt-1">
                            <button
                                onClick={() => setActiveTab('valorant')}
                                className={`profile-tab-btn flex items-center gap-2.5 px-5 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'valorant' ? 'text-red-400' : 'text-neutral-600 hover:text-neutral-400'}`}>
                                <SiValorant className="text-base" /> Valorant
                                {activeTab === 'valorant' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 to-orange-500 rounded-t shadow-[0_-4px_15px_rgba(255,70,85,0.5)]"></span>}
                            </button>
                            <button
                                onClick={() => setActiveTab('lol')}
                                className={`profile-tab-btn flex items-center gap-2.5 px-5 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'lol' ? 'text-blue-400' : 'text-neutral-600 hover:text-neutral-400'}`}>
                                <SiLeagueoflegends className="text-base" /> League of Legends
                                {activeTab === 'lol' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t shadow-[0_-4px_15px_rgba(59,130,246,0.5)]"></span>}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 min-h-[350px]">
                            {matchesLoading ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-4">
                                    <div className="three-body"><div className="three-body__dot"></div><div className="three-body__dot"></div><div className="three-body__dot"></div></div>
                                    <p className="text-neutral-600 text-xs uppercase tracking-[0.3em] font-bold">Loading Matches</p>
                                </div>
                            ) : activeTab === 'valorant' ? (
                                <ValMatchList matches={valMatches} />
                            ) : (
                                <LolMatchList matches={lolMatches} puuid={playerPuuid} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════
//  VALORANT MATCH LIST
// ═══════════════════════════════════════════
const ValMatchList = ({ matches }) => {
    if (!matches || matches.length === 0) {
        return <EmptyState message="No Valorant match data found" icon={<SiValorant className="text-3xl text-red-500/40" />} />;
    }
    return (
        <div className="space-y-3">
            {matches.map((match, i) => {
                const isWin = match.mmr_change_to_last_game >= 0;
                const result = match.mmr_change_to_last_game > 0 ? 'VICTORY' : match.mmr_change_to_last_game < 0 ? 'DEFEAT' : 'DRAW';

                return (
                    <div key={match.match_id || i} className="profile-match-card group relative overflow-hidden rounded-xl border border-white/[0.04] hover:border-white/10 transition-all duration-300 hover:translate-x-1">
                        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${isWin ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]'}`}></div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-5 py-4 pl-6 bg-white/[0.015] group-hover:bg-white/[0.04] transition-colors">
                            <div className="flex flex-col items-center md:items-start min-w-[140px]">
                                <span className={`font-black text-lg tracking-wide ${isWin ? 'text-cyan-400' : 'text-rose-400'}`}>{result}</span>
                                <span className="text-neutral-500 text-xs uppercase font-bold tracking-widest">{match.map?.name || 'Unknown'}</span>
                                <span className="text-neutral-700 text-[11px] mt-0.5">{match.date}</span>
                            </div>
                            <div className="flex items-center gap-4 flex-1">
                                {match.images?.small && (
                                    <div className="relative w-11 h-11">
                                        <img src={match.images.small} alt="Rank" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]" />
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-white">{match.currenttier_patched}</div>
                                    <div className="text-sm text-neutral-500 flex gap-2 items-center">
                                        RR: <span className={`font-mono font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                                            {match.mmr_change_to_last_game > 0 ? '+' : ''}{match.mmr_change_to_last_game}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right hidden md:block">
                                <div className="text-xl font-bold text-neutral-300">{match.elo} <span className="text-xs text-neutral-700">ELO</span></div>
                                <div className="text-xs text-neutral-700">Tier: {match.ranking_in_tier}</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ═══════════════════════════════════════════
//  LOL MATCH LIST
// ═══════════════════════════════════════════
const LolMatchList = ({ matches, puuid }) => {
    if (!matches || matches.length === 0) {
        return <EmptyState message="No League of Legends match data found" icon={<SiLeagueoflegends className="text-3xl text-blue-500/40" />} />;
    }
    return (
        <div className="space-y-3">
            {matches.map((match, i) => {
                if (!match.info) return null;
                const participant = match.info.participants.find(p => p.puuid === puuid);
                if (!participant) return null;
                const isWin = participant.win;
                const durationMin = Math.floor(match.info.gameDuration / 60);
                const gameDate = new Date(match.info.gameCreation).toLocaleDateString();
                const kda = ((participant.kills + participant.assists) / Math.max(1, participant.deaths)).toFixed(2);

                return (
                    <div key={match.metadata?.matchId || i} className="profile-match-card group relative overflow-hidden rounded-xl border border-white/[0.04] hover:border-white/10 transition-all duration-300 hover:translate-x-1">
                        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${isWin ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]'}`}></div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-5 py-4 pl-6 bg-white/[0.015] group-hover:bg-white/[0.04] transition-colors">
                            <div className="flex flex-col items-center md:items-start min-w-[120px]">
                                <span className={`font-black text-lg ${isWin ? 'text-blue-400' : 'text-red-400'}`}>{isWin ? 'VICTORY' : 'DEFEAT'}</span>
                                <span className="text-neutral-500 text-xs uppercase font-bold">{match.info.gameMode}</span>
                                <span className="text-neutral-700 text-[11px] mt-0.5">{gameDate} • {durationMin}m</span>
                            </div>
                            <div className="flex items-center gap-4 flex-1">
                                <div className="relative w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden border border-white/10">
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${participant.championName}.png`} alt={participant.championName}
                                        className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                                </div>
                                <div>
                                    <div className="font-bold text-white">{participant.championName}</div>
                                    <div className="text-sm text-neutral-400 flex gap-1">
                                        <span className="text-white font-mono">{participant.kills}</span>/
                                        <span className="text-red-400 font-mono">{participant.deaths}</span>/
                                        <span className="text-white font-mono">{participant.assists}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right hidden md:block">
                                <div className="text-xl font-bold text-neutral-300">{kda} <span className="text-xs text-neutral-700">KDA</span></div>
                                <div className="text-xs text-neutral-500">{participant.totalMinionsKilled + participant.neutralMinionsKilled} CS</div>
                                <div className="text-sm text-yellow-500/80 mt-0.5">{participant.goldEarned.toLocaleString()} Gold</div>
                            </div>
                            <div className="flex gap-1">
                                {[participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5].map((item, idx) => (
                                    <div key={idx} className="w-8 h-8 bg-neutral-800/60 rounded border border-white/5 overflow-hidden">
                                        {item > 0 && <img src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/${item}.png`} alt="" className="w-full h-full" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ═══════════════════════════════════════════
//  EMPTY STATE
// ═══════════════════════════════════════════
const EmptyState = ({ message, icon }) => (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-20 h-20 rounded-2xl border border-white/[0.06] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
            {icon || <FaGamepad className="text-3xl text-neutral-700" />}
        </div>
        <p className="text-neutral-500 text-sm font-medium">{message}</p>
        <p className="text-neutral-700 text-xs">Try searching for a player above or check back later</p>
    </div>
);

export default UserProfile;
