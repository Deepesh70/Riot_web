import React, { useRef } from 'react';
import { TiStarFullOutline, TiFlash } from 'react-icons/ti';
import { FaTrophy } from 'react-icons/fa';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';

const UserProfile = () => {
    // State for user data
    const [userData, setUserData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Mock User Data (Fallback/Extended info not in DB)
    const mockExtendedData = {
        tag: "#9021",
        level: 42,
        xp: 8500,
        maxXp: 10000,
        rank: "Diamond II",
        avatar: "https://ui-avatars.com/api/?name=Night+Stalker&background=0D8ABC&color=fff&size=128",
        coverString: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop", // Gaming setup/neon
        stats: {
            matches: 142,
            wins: 89,
            winRate: "62.6%",
            kdClass: "2.4"
        }
    };

    const [activeTab, setActiveTab] = React.useState('valorant');

    const gamesData = {
        valorant: {
            label: "Valorant",
            matches: [
                { id: 1, result: 'VICTORY', score: '13-9', map: 'Haven', kda: '24/12/5', agent: 'Jett', time: '2h ago', color: 'green' },
                { id: 2, result: 'DEFEAT', score: '11-13', map: 'Ascent', kda: '18/15/4', agent: 'Omen', time: '5h ago', color: 'red' },
                { id: 3, result: 'VICTORY', score: '13-5', map: 'Split', kda: '29/8/2', agent: 'Reyna', time: '1d ago', color: 'green' },
            ]
        },
        league: {
            label: "League of Legends",
            matches: [
                { id: 1, result: 'VICTORY', score: 'Win', map: "Summoner's Rift", kda: '12/2/15', agent: 'Ahri', time: '3h ago', color: 'green' },
                { id: 2, result: 'DEFEAT', score: 'Loss', map: 'Howling Abyss', kda: '5/8/12', agent: 'Yasuo', time: '6h ago', color: 'red' },
                { id: 3, result: 'VICTORY', score: 'Win', map: "Summoner's Rift", kda: '8/1/10', agent: 'Lee Sin', time: '2d ago', color: 'green' },
            ]
        },
        tft: {
            label: "Teamfight Tactics",
            matches: [
                { id: 1, result: 'TOP 1', score: '1st', map: 'Convergence', kda: 'N/A', agent: 'Pengu', time: '1h ago', color: 'blue' },
                { id: 2, result: 'TOP 4', score: '3rd', map: 'Convergence', kda: 'N/A', agent: 'Furyhorn', time: '4h ago', color: 'purple' },
            ]
        }
    };

    React.useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please login.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Merge DB data with mock data for display
    const user = userData ? { ...mockExtendedData, ...userData, username: userData.name, avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=0D8ABC&color=fff&size=128` } : mockExtendedData;

    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.profile-bg', {
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out'
        })
            .from('.profile-header', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            }, '-=1')
            .from('.stat-card', {
                y: 30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.4')
            .from('.activity-item', {
                x: -20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power1.out'
            }, '-=0.2');

    }, { scope: containerRef });


    useGSAP(() => {
        gsap.fromTo('.match-card',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
        );
    }, { dependencies: [activeTab], scope: containerRef });

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Profile...</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <p className="text-red-500 font-bold text-xl">Error: {error}</p>
                <a href="/login" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">Go to Login</a>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
            <Navbar />
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 profile-bg">
                <img
                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20 blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            <div className="relative z-10 pt-24 px-4 sm:px-8 max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="profile-header relative bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group shadow-2xl mb-10">
                    {/* Cover Image */}
                    <div className="h-48 overflow-hidden relative">
                        <img
                            src={user.coverString}
                            alt="Cover"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/90"></div>
                    </div>

                    <div className="px-8 pb-8 -mt-16 flex flex-col md:flex-row items-end gap-6 md:gap-10">
                        <div className="relative shrink-0">
                            <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-[6px] border-neutral-900"
                                />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-yellow-500 text-black font-black text-sm px-3 py-1 rounded-full border-4 border-neutral-900 flex items-center gap-1 shadow-lg">
                                <TiStarFullOutline /> <span>LVL {user.level}</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left w-full">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                <h1 className="text-5xl font-black uppercase tracking-tight italic glitch-effect" data-text={user.username}>
                                    {user.username}
                                    <span className="text-neutral-400 text-2xl ml-2 font-medium not-italic tracking-normal">{user.tag}</span>
                                </h1>
                                <div className="hidden md:block">
                                    <button className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-neutral-200 transition-colors uppercase tracking-wider text-sm">Edit Profile</button>
                                </div>
                            </div>

                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-xl mb-6 flex items-center justify-center md:justify-start gap-2">
                                <FaTrophy className="text-yellow-400" /> {user.rank}
                            </p>

                            {/* XP Bar */}
                            <div className="w-full max-w-md bg-neutral-800/80 backdrop-blur rounded-full h-3 overflow-hidden relative mx-auto md:mx-0 ring-1 ring-white/10">
                                <div
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                    style={{ width: `${(user.xp / user.maxXp) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-neutral-500 text-xs mt-2 font-mono tracking-wider">{user.xp} / {user.maxXp} XP</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        label="Matches"
                        value={user.stats.matches}
                        icon={<TiFlash className="text-blue-500 text-3xl drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                        delay={0}
                    />
                    <StatCard
                        label="Victories"
                        value={user.stats.wins}
                        icon={<FaTrophy className="text-yellow-500 text-3xl drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />}
                        delay={1}
                    />
                    <StatCard
                        label="Win Rate"
                        value={user.stats.winRate}
                        icon={<TiStarFullOutline className="text-purple-500 text-3xl drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />}
                        subValue={`KD RATIO: ${user.stats.kdClass}`}
                        delay={2}
                    />
                </div>

                {/* Games Tab Section */}
                <div className="border border-white/10 bg-neutral-900/40 backdrop-blur-md rounded-3xl p-8 mb-20 animate-bg-pulse">
                    
                    {/* Tabs Header */}
                    <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-white/10 pb-4">
                         {Object.keys(gamesData).map((gameKey) => (
                            <button
                                key={gameKey}
                                onClick={() => setActiveTab(gameKey)}
                                className={`text-xl font-black uppercase tracking-wider transition-colors relative pb-2 ${activeTab === gameKey ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                            >
                                {gamesData[gameKey].label}
                                {activeTab === gameKey && (
                                    <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-t-full shadow-[0_-2px_10px_#3b82f6]"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Matches List */}
                    <div className="space-y-4 min-h-[300px]">
                        {gamesData[activeTab].matches.map((match) => (
                            <div key={match.id} className="match-card group flex items-center justify-between bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10 hover:translate-x-1">
                                <div className="flex items-center gap-5">
                                    <div className={`w-2 h-12 rounded-full shadow-[0_0_10px] 
                                        ${match.color === 'green' ? 'bg-green-500 shadow-green-500/50' : 
                                          match.color === 'red' ? 'bg-red-500 shadow-red-500/50' : 
                                          match.color === 'blue' ? 'bg-blue-500 shadow-blue-500/50' :
                                          'bg-purple-500 shadow-purple-500/50'
                                        }`}></div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-white text-neutral-200 transition-colors">{match.result} <span className="text-neutral-500 text-sm font-medium ml-2">{match.score}</span></h3>
                                        <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest mt-0.5">{match.time} • Map: {match.map} • Agent: {match.agent}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`block font-black text-xl tracking-wide 
                                        ${match.color === 'green' ? 'text-green-400' : 
                                          match.color === 'red' ? 'text-red-400' : 
                                          match.color === 'blue' ? 'text-blue-400' : 
                                          'text-purple-400'}`}>
                                        {activeTab === 'tft' ? match.result : (match.result === 'VICTORY' ? 'WON' : 'LOST')}
                                    </span>
                                    <span className="text-neutral-500 text-sm font-bold">{match.kda !== 'N/A' && match.kda}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper Component for Stats
const StatCard = ({ label, value, icon, subValue, delay }) => (
    <div className={`stat-card bg-neutral-900/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex items-center justify-between hover:scale-[1.02] hover:bg-neutral-800/80 transition-all duration-300 group shadow-lg`}>
        <div>
            <p className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-2 group-hover:text-white transition-colors">{label}</p>
            <h3 className="text-4xl font-black text-white tracking-tight">{value}</h3>
            {subValue && <p className="text-neutral-500 text-xs mt-2 font-mono">{subValue}</p>}
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
            {icon}
        </div>
    </div>
);

export default UserProfile;
