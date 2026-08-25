import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TiArrowBack, TiStarFullOutline } from 'react-icons/ti'; // Assuming these exist or I'll use simple text

import Navbar from '../components/common/Navbar';

const PlayerStats = () => {
    const { game, gameName, tagLine } = useParams();
    const [playerData, setPlayerData] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [persona, setPersona] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchPlayerAndMatches = async () => {
            try {
                setLoading(true);
                let accData = null;

                // 1. Get Account Info
                const accRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/riot/account/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
                if (accRes.ok) {
                    accData = await accRes.json();
                    setPlayerData(accData);
                } else {
                    console.warn(`Riot Account API failed with status: ${accRes.status}`);
                    if (game === 'val') {
                        // For Valorant, we can proceed without Riot Account data if we just use name/tag
                        accData = { gameName, tagLine };
                        setPlayerData(accData); 
                    } else {
                        // For LoL, we likely need PUUID from account endpoint, so we can't easily proceed
                        throw new Error(`Player lookup failed: ${accRes.statusText || 'Start server/Check API Key'}`);
                    }
                }

                // 2. Get Matches
                let matchesUrl;
                if (game === 'val') {
                    matchesUrl = `${import.meta.env.VITE_API_BASE_URL}/api/users/riot/matches/val/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
                    // 2.5 Fetch Playstyle Persona for Valorant
                    try {
                        const playstyleRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/riot/val/playstyle/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
                        if (playstyleRes.ok) {
                            const pData = await playstyleRes.json();
                            setPersona(pData.persona);
                        }
                    } catch(e) { console.error('Persona fetch failed', e); }
                } else {
                    // LoL needs PUUID
                    if (!accData) throw new Error("Could not retrieve account for LoL match history");
                    matchesUrl = `${import.meta.env.VITE_API_BASE_URL}/api/users/riot/matches/lol/${accData.puuid}`;
                }

                const matchesRes = await fetch(matchesUrl);
                if (!matchesRes.ok) throw new Error('Failed to fetch matches');
                const matchesData = await matchesRes.json();
                setMatches(matchesData);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerAndMatches();
    }, [game, gameName, tagLine]);



    if (loading) return <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center font-bold text-base font-mono uppercase tracking-widest">Loading Match History...</div>;
    if (error) return (
        <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center gap-4">
            <p className="text-accent-primary font-bold text-xl font-mono">Error: {error}</p>
            <Link to="/profile" className="text-accent-primary hover:underline text-sm font-bold uppercase tracking-wider">Back to Profile</Link>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-dark-900 text-white font-sans">
            <Navbar />
            
            <div className="pt-28 px-4 max-w-6xl mx-auto pb-20">
                <Link to="/profile" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors text-xs font-bold uppercase tracking-wider">
                    <span>&larr;</span> Back to Search
                </Link>

                {/* Header */}
                <div className="bg-dark-800/80 border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-6 backdrop-blur-md">
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black font-riot border-2 border-white/10 shadow-xl bg-gradient-to-br from-accent-primary to-accent-secondary text-black">
                        {gameName?.[0]}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight flex items-baseline gap-2 font-riot">
                            {playerData?.gameName}
                            <span className="text-xl text-white/40 font-medium font-mono">#{playerData?.tagLine}</span>
                        </h1>
                        <p className="font-mono text-xs mt-1 uppercase text-accent-primary font-bold tracking-wider">
                            {game === 'val' ? 'Valorant' : 'League of Legends'} Match History
                        </p>
                        
                        {persona && game === 'val' && (
                            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md shadow-lg" 
                                 style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${persona.color}20)` }}>
                                 <div className="text-left">
                                     <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: persona.color }}>ML Persona</p>
                                     <p className="text-base font-black uppercase tracking-tight text-white">{persona.title}</p>
                                 </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Match List */}
                <h2 className="text-2xl font-black mb-6 border-l-4 border-accent-primary pl-4 font-riot uppercase">Recent Matches</h2>
                <div className="space-y-4">
                    {matches.map((match, index) => {
                        // LoL Rendering
                        if (game === 'lol') {
                            if (!match.info) return null;
                            const participant = match.info.participants.find(p => p.puuid === playerData.puuid);
                            const isWin = participant?.win;
                            const gameDurationMinutes = Math.floor(match.info.gameDuration / 60);
                            const gameCreation = new Date(match.info.gameCreation).toLocaleDateString();

                            return (
                                <div key={match.metadata?.matchId || index} className="match-card relative overflow-hidden bg-dark-800/80 border border-white/10 rounded-2xl p-5 hover:border-accent-primary/40 transition-all duration-300 group">
                                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${isWin ? 'bg-accent-primary shadow-[0_0_10px_rgba(79,183,221,0.6)]' : 'bg-white/20'}`}></div>
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pl-4">
                                        <div className="flex flex-col items-center md:items-start min-w-[120px]">
                                            <span className={`font-black text-lg font-riot ${isWin ? 'text-accent-primary' : 'text-white/40'}`}>{isWin ? 'VICTORY' : 'DEFEAT'}</span>
                                            <span className="text-white/50 text-xs uppercase font-bold">{match.info.gameMode}</span>
                                            <span className="text-white/30 text-xs font-mono">{gameCreation} • {gameDurationMinutes}m</span>
                                        </div>
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative w-12 h-12 rounded-xl bg-dark-700 overflow-hidden border border-white/10">
                                                <img src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${participant?.championName}.png`} alt={participant?.championName} className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'}} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{participant?.championName}</div>
                                                <div className="text-sm text-white/50 flex gap-2 font-mono">
                                                    <span className="text-white">{participant?.kills}</span>/<span className="text-white/40">{participant?.deaths}</span>/<span className="text-white">{participant?.assists}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <div className="text-xl font-bold text-white font-mono">{((participant?.kills + participant?.assists) / Math.max(1, participant?.deaths)).toFixed(2)} <span className="text-xs text-white/40">KDA</span></div>
                                            <div className="text-xs text-white/40 font-mono">{participant?.totalMinionsKilled + participant?.neutralMinionsKilled} CS</div>
                                            <div className="text-sm text-accent-tertiary mt-1 font-mono">{participant?.goldEarned.toLocaleString()} Gold</div>
                                        </div>
                                        <div className="flex gap-1">
                                            {[participant?.item0, participant?.item1, participant?.item2, participant?.item3, participant?.item4, participant?.item5].map((item, i) => (
                                                <div key={i} className="w-8 h-8 bg-dark-700 rounded border border-white/5 overflow-hidden">
                                                    {item > 0 && <img src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/${item}.png`} alt="" className="w-full h-full" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        } 
                        // Valorant Rendering (HenrikDev MMR History)
                        else if (game === 'val') {
                            const isWin = match.mmr_change_to_last_game >= 0; 
                            const gameCreation = match.date; 
                            
                            return (
                                <div key={match.match_id || index} className="match-card relative overflow-hidden bg-dark-800/80 border border-white/10 rounded-2xl p-5 hover:border-accent-primary/40 transition-all duration-300 group">
                                     <div className={`absolute left-0 top-0 bottom-0 w-2 ${isWin ? 'bg-accent-primary shadow-[0_0_10px_rgba(79,183,221,0.6)]' : 'bg-white/20'}`}></div>
                                     <div className="flex flex-col md:flex-row items-center justify-between gap-4 pl-4">
                                        
                                        {/* Result & Map */}
                                        <div className="flex flex-col items-center md:items-start min-w-[150px]">
                                            <span className={`font-black text-lg font-riot ${isWin ? 'text-accent-primary' : 'text-white/40'}`}>
                                                {match.mmr_change_to_last_game > 0 ? 'VICTORY' : match.mmr_change_to_last_game < 0 ? 'DEFEAT' : 'DRAW'}
                                            </span>
                                            <span className="text-white/50 text-xs uppercase font-bold">{match.map?.name || 'Unknown Map'}</span>
                                            <span className="text-white/30 text-xs font-mono">{gameCreation}</span>
                                        </div>

                                        {/* Rank Info */}
                                        <div className="flex items-center gap-6 flex-1">
                                            {match.images?.small && (
                                                <div className="relative w-12 h-12">
                                                    <img src={match.images.small} alt="Rank" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-white text-lg">{match.currenttier_patched}</div>
                                                <div className="text-sm text-white/50 flex gap-2 items-center">
                                                    RR Change: 
                                                    <span className={`font-mono font-bold ${isWin ? 'text-accent-primary' : 'text-white/40'}`}>
                                                        {match.mmr_change_to_last_game > 0 ? '+' : ''}{match.mmr_change_to_last_game}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats (ELO) */}
                                        <div className="text-right hidden md:block">
                                            <div className="text-xl font-bold text-white font-mono">{match.elo} <span className="text-xs text-white/40">ELO</span></div>
                                            <div className="text-xs text-white/40 font-mono">Ranking in Tier: {match.ranking_in_tier}</div>
                                        </div>
                                     </div>
                                </div>
                            )
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlayerStats;
