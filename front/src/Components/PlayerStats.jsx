import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TiArrowBack, TiStarFullOutline } from 'react-icons/ti'; // Assuming these exist or I'll use simple text
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from './Navbar';

const PlayerStats = () => {
    const { game, gameName, tagLine } = useParams();
    const [playerData, setPlayerData] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchPlayerAndMatches = async () => {
            try {
                setLoading(true);
                let accData = null;

                // 1. Get Account Info
                const accRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/riot/account/${gameName}/${tagLine}`);
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
                    matchesUrl = `${import.meta.env.VITE_API_BASE_URL}/api/users/riot/matches/val/${gameName}/${tagLine}`;
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

    useGSAP(() => {
        if (!loading && matches.length > 0) {
            gsap.from('.match-card', {
                y: 30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    }, { dependencies: [loading, matches], scope: containerRef });

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-bold text-xl">Loading Match History...</div>;
    if (error) return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
            <p className="text-red-500 font-bold text-2xl">Error: {error}</p>
            <Link to="/profile" className="text-blue-500 hover:underline">Back to Profile</Link>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-sans">
            <Navbar />
            
            <div className="pt-24 px-4 max-w-6xl mx-auto">
                <Link to="/profile" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
                    <span>&larr;</span> Back to Search
                </Link>

                {/* Header */}
                <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-6 backdrop-blur-md">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-neutral-800 shadow-xl ${game === 'val' ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`}>
                        {gameName?.[0]}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight flex items-baseline gap-2">
                            {playerData?.gameName}
                            <span className="text-xl text-neutral-500 font-medium">#{playerData?.tagLine}</span>
                        </h1>
                        <p className={`font-mono text-sm mt-1 uppercase ${game === 'val' ? 'text-red-400' : 'text-blue-400'}`}>
                            {game === 'val' ? 'Valorant' : 'League of Legends'} Match History
                        </p>
                    </div>
                </div>

                {/* Match List */}
                <h2 className={`text-2xl font-bold mb-6 border-l-4 pl-4 ${game === 'val' ? 'border-red-500' : 'border-blue-500'}`}>Recent Matches</h2>
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
                                <div key={match.metadata.matchId} className="match-card relative overflow-hidden bg-neutral-900 border border-white/5 rounded-xl p-4 hover:border-white/20 transition-colors group">
                                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${isWin ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pl-4">
                                        <div className="flex flex-col items-center md:items-start min-w-[120px]">
                                            <span className={`font-bold text-lg ${isWin ? 'text-green-400' : 'text-red-400'}`}>{isWin ? 'VICTORY' : 'DEFEAT'}</span>
                                            <span className="text-neutral-500 text-xs uppercase">{match.info.gameMode}</span>
                                            <span className="text-neutral-600 text-xs">{gameCreation} • {gameDurationMinutes}m</span>
                                        </div>
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden border border-white/10">
                                                <img src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${participant?.championName}.png`} alt={participant?.championName} className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'}} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{participant?.championName}</div>
                                                <div className="text-sm text-neutral-400 flex gap-2">
                                                    <span className="text-white font-mono">{participant?.kills}</span>/<span className="text-red-400 font-mono">{participant?.deaths}</span>/<span className="text-white font-mono">{participant?.assists}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <div className="text-xl font-bold text-neutral-300">{((participant?.kills + participant?.assists) / Math.max(1, participant?.deaths)).toFixed(2)} <span className="text-xs text-neutral-500">KDA</span></div>
                                            <div className="text-xs text-neutral-500">{participant?.totalMinionsKilled + participant?.neutralMinionsKilled} CS</div>
                                            <div className="text-sm text-yellow-500/80 mt-1">{participant?.goldEarned.toLocaleString()} Gold</div>
                                        </div>
                                        <div className="flex gap-1">
                                            {[participant?.item0, participant?.item1, participant?.item2, participant?.item3, participant?.item4, participant?.item5].map((item, i) => (
                                                <div key={i} className="w-8 h-8 bg-neutral-800 rounded border border-white/5 overflow-hidden">
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
                            // API returns: { currenttier_patched, mmr_change_to_last_game, map: { name }, date, ranking_in_tier, images }
                            const isWin = match.mmr_change_to_last_game >= 0; 
                            // Note: 0 could be draw or just no change, treating as non-loss for color
                            const gameCreation = match.date; 
                            
                            return (
                                <div key={match.match_id || index} className="match-card relative overflow-hidden bg-neutral-900 border border-white/5 rounded-xl p-4 hover:border-white/20 transition-colors group">
                                     <div className={`absolute left-0 top-0 bottom-0 w-2 ${isWin ? 'bg-cyan-500' : 'bg-rose-500'}`}></div>
                                     <div className="flex flex-col md:flex-row items-center justify-between gap-4 pl-4">
                                        
                                        {/* Result & Map */}
                                        <div className="flex flex-col items-center md:items-start min-w-[150px]">
                                            <span className={`font-bold text-lg ${isWin ? 'text-cyan-400' : 'text-rose-400'}`}>
                                                {match.mmr_change_to_last_game > 0 ? 'VICTORY' : match.mmr_change_to_last_game < 0 ? 'DEFEAT' : 'DRAW'}
                                            </span>
                                            <span className="text-neutral-500 text-xs uppercase">{match.map?.name || 'Unknown Map'}</span>
                                            <span className="text-neutral-600 text-xs">{gameCreation}</span>
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
                                                <div className="text-sm text-neutral-400 flex gap-2 items-center">
                                                    RR Change: 
                                                    <span className={`font-mono font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                                                        {match.mmr_change_to_last_game > 0 ? '+' : ''}{match.mmr_change_to_last_game}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats (ELO) */}
                                        <div className="text-right hidden md:block">
                                            <div className="text-xl font-bold text-neutral-300">{match.elo} <span className="text-xs text-neutral-500">ELO</span></div>
                                            <div className="text-xs text-neutral-500">Ranking in Tier: {match.ranking_in_tier}</div>
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
