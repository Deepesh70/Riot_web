import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const API = import.meta.env.VITE_API_BASE_URL;

const ValorantPage = () => {
    const [agents, setAgents] = useState([]);
    const [maps, setMaps] = useState([]);
    const [featuredAgent, setFeaturedAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllAgents, setShowAllAgents] = useState(false);
    const [showAllMaps, setShowAllMaps] = useState(false);
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const sectionsRef = useRef([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [agentsRes, mapsRes] = await Promise.all([
                    fetch(`${API}/api/valorant/agents`),
                    fetch(`${API}/api/valorant/maps`)
                ]);
                const agentsData = await agentsRes.json();
                const mapsData = await mapsRes.json();
                setAgents(agentsData.data || []);
                setMaps(mapsData.data || []);
                // Pick ISO as featured agent, fallback to first duelist
                const iso = agentsData.data?.find(a => a.displayName === 'Is    o');
                setFeaturedAgent(iso || agentsData.data?.[0]);
            } catch (err) {
                console.error('Error fetching Valorant data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (loading) return;
        // Hero animations
        gsap.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' });
        // Section reveal animations
        sectionsRef.current.forEach((section) => {
            if (!section) return;
            gsap.fromTo(section,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' } }
            );
        });
    }, [loading]);

    const addSectionRef = (el) => {
        if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el);
    };

    // Get featured agents (different roles shown)
    const duelists = agents.filter(a => a.role?.displayName === 'Duelist').slice(0, 3);
    const allRoleAgents = [
        agents.find(a => a.role?.displayName === 'Duelist'),
        agents.find(a => a.role?.displayName === 'Sentinel'),
        agents.find(a => a.role?.displayName === 'Controller'),
        agents.find(a => a.role?.displayName === 'Initiator'),
    ].filter(Boolean);

    const displayedMaps = showAllMaps ? maps : maps.slice(0, 4);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f1923] flex items-center justify-center">
                <div className="three-body">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="valorant-page bg-[#0f1923] text-white">
            {/* ═══ HERO SECTION ═══ */}
            <section ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff4655]/20 via-[#0f1923] to-[#0f1923]" />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(255, 70, 85, 0.15) 0%, transparent 60%)' }} />

                <div ref={titleRef} className="relative z-10 text-center px-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src="/img/logo.png" alt="Riot Games" className="w-10 h-10 rounded-full" />
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">Riot Games</span>
                    </div>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-white/50 mb-3">5v5 character-based tactical shooter game</p>
                    <h1 className="font-riot text-6xl sm:text-8xl md:text-[10rem] lg:text-[14rem] font-black tracking-tight leading-none uppercase"
                        style={{ background: 'linear-gradient(180deg, #fff 30%, #ff4655 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        VALORANT
                    </h1>
                    <button className="mt-8 px-10 py-3 bg-[#ff4655] text-white font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-[#e83e4d] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,70,85,0.4)] hover:scale-105 cursor-pointer">
                        Play for Free
                    </button>
                </div>

                {/* Decorative agents on sides */}
                {duelists[0] && (
                    <img src={duelists[0].fullPortrait} alt="" className="absolute -bottom-10 -left-10 h-[60vh] opacity-20 pointer-events-none hidden lg:block" />
                )}
                {duelists[1] && (
                    <img src={duelists[1].fullPortrait} alt="" className="absolute -bottom-10 -right-10 h-[60vh] opacity-20 pointer-events-none hidden lg:block" />
                )}
            </section>

            {/* ═══ LATEST ARTICLES ═══ */}
            <section ref={addSectionRef} className="relative py-20 px-4 sm:px-8 lg:px-16" style={{ background: 'linear-gradient(135deg, #ece8e1 0%, #e8d8c4 100%)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-10">
                        <h2 className="font-riot text-4xl sm:text-5xl md:text-6xl font-black uppercase text-[#0f1923] leading-none">
                            Latest<br />Articles
                        </h2>
                        <a href="#" className="text-[#0f1923] text-xs uppercase font-bold tracking-widest hover:text-[#ff4655] transition-colors border-b border-[#0f1923]/30 pb-1">
                            Go to Articles Page →
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {agents.slice(0, 3).map((agent, i) => (
                            <div key={agent.uuid} className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-lg aspect-video mb-4"
                                    style={{ background: `linear-gradient(135deg, #${agent.backgroundGradientColors?.[0]?.slice(0, 6) || '1a1a2e'}, #${agent.backgroundGradientColors?.[2]?.slice(0, 6) || '16213e'})` }}>
                                    <img src={agent.fullPortrait} alt={agent.displayName} className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[110%] object-contain group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ff4655] px-2 py-1 rounded text-white">
                                            {agent.role?.displayName}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-[#0f1923] font-bold text-sm uppercase tracking-wider group-hover:text-[#ff4655] transition-colors">
                                    {['Community Roundup October 2023', 'Community Creations October 2023', 'Community Roadmap October 2023'][i]}
                                </h3>
                                <p className="text-[#0f1923]/50 text-xs mt-1">GAME UPDATES • 10/{i + 1}/23</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ EPISODE / ACT BANNER ═══ */}
            {featuredAgent && (
                <section ref={addSectionRef} className="relative py-0 overflow-hidden" style={{ minHeight: '60vh' }}>
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #${featuredAgent.backgroundGradientColors?.[0]?.slice(0, 6) || '30336e'} 0%, #0f1923 50%, #${featuredAgent.backgroundGradientColors?.[2]?.slice(0, 6) || '20155d'} 100%)` }} />

                    <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center min-h-[60vh]">
                        {/* Agent Portrait */}
                        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-start">
                            <img src={featuredAgent.background} alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] opacity-30" />
                            <img src={featuredAgent.fullPortrait} alt={featuredAgent.displayName} className="relative z-10 h-[50vh] lg:h-[70vh] object-contain drop-shadow-2xl" />
                        </div>

                        {/* Episode Info */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-16 text-center lg:text-left">
                            <p className="text-xs uppercase tracking-[0.5em] text-white/40 mb-2">Episode 09 // Act III // Yr 3</p>
                            <h2 className="font-riot text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-none mb-6"
                                style={{ background: 'linear-gradient(135deg, #ff4655, #ff8a65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Evolution
                            </h2>

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                                    {featuredAgent.displayIcon && <img src={featuredAgent.displayIcon} alt="" className="w-10 h-10" />}
                                    <div>
                                        <h3 className="text-2xl font-black uppercase">{featuredAgent.displayName}</h3>
                                        <div className="flex items-center gap-2">
                                            {featuredAgent.role?.displayIcon && <img src={featuredAgent.role.displayIcon} alt="" className="w-4 h-4 brightness-200" />}
                                            <span className="text-xs uppercase tracking-widest text-white/60">{featuredAgent.role?.displayName}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white/50 text-sm leading-relaxed max-w-md mt-4">{featuredAgent.description}</p>
                            </div>

                            <button className="px-8 py-3 bg-[#ff4655] text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#e83e4d] transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,70,85,0.4)] cursor-pointer">
                                Act Summary →
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ WE ARE VALORANT ═══ */}
            <section ref={addSectionRef} className="relative py-24 px-4 sm:px-8 lg:px-16 overflow-hidden" style={{ background: 'linear-gradient(180deg, #ece8e1 0%, #e2d5c3 100%)' }}>
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h2 className="font-riot text-5xl sm:text-6xl md:text-7xl font-black uppercase text-[#0f1923] leading-[0.9] mb-6">
                            We Are<br />Valorant
                        </h2>
                        <h3 className="text-xl font-black uppercase text-[#0f1923] mb-4 tracking-wider">Defy the Limits</h3>
                        <p className="text-[#0f1923]/60 text-sm leading-relaxed max-w-lg mb-8">
                            Blend your style and experience on a global, competitive stage. You get to pick your character, your team gets to pick the strategy.
                            Take on enemies with sharp gunplay and tactical abilities. It's a world where creativity is your greatest weapon – make the play others will remember for years.
                            Team up with friends. Take on challenges. And show the world what you're made of with Deathmatch and Spike Rush.
                        </p>
                        <button className="px-10 py-3 bg-[#ff4655] text-white font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-[#e83e4d] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,70,85,0.3)] cursor-pointer">
                            Enter the Rift
                        </button>
                    </div>
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative flex justify-center items-end h-[50vh]">
                            {allRoleAgents.slice(0, 4).map((agent, i) => (
                                <img key={agent.uuid} src={agent.fullPortrait} alt={agent.displayName}
                                    className="absolute bottom-0 h-[90%] object-contain drop-shadow-xl transition-all duration-500"
                                    style={{
                                        left: `${10 + i * 18}%`,
                                        zIndex: i === 1 ? 10 : 5 - Math.abs(i - 1),
                                        transform: `scale(${i === 1 ? 1.1 : 0.9}) translateY(${i === 1 ? '0' : '10px'})`,
                                        filter: i === 1 ? 'none' : 'brightness(0.7)',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ YOUR AGENTS ═══ */}
            <section ref={addSectionRef} className="relative py-24 px-4 sm:px-8 lg:px-16">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f1923] via-[#1a1030] to-[#0f1923]" />
                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-riot text-5xl sm:text-6xl md:text-8xl font-black uppercase leading-[0.9]"
                            style={{ background: 'linear-gradient(180deg, #fff 0%, #ff4655 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Your<br />Agents
                        </h2>
                        <h3 className="text-lg font-black uppercase tracking-wider mt-4 mb-3 text-white/90">Creativity is Your Greatest Weapon</h3>
                        <p className="text-white/40 text-sm max-w-2xl mx-auto leading-relaxed">
                            Each Agent brings unique abilities to the fight. Master them all, find your favorites, and lead your team to victory.
                            Duelists, Sentinels, Controllers, and Initiators — build the perfect composition for every strategy.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {(showAllAgents ? agents : agents.slice(0, 12)).map((agent) => (
                            <Link
                                to={`/games/valorant/agents/${agent.uuid}`}
                                key={agent.uuid}
                                className="group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 block"
                                style={{ background: `linear-gradient(180deg, #${agent.backgroundGradientColors?.[0]?.slice(0, 6) || '1a1a2e'}90, #0f1923)` }}
                            >
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img src={agent.background} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
                                    <img src={agent.fullPortrait} alt={agent.displayName}
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[110%] object-contain group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <div className="flex items-center gap-1 mb-1">
                                            {agent.role?.displayIcon && (
                                                <img src={agent.role.displayIcon} alt="" className="w-3 h-3 brightness-200 opacity-60" />
                                            )}
                                            <span className="text-[9px] uppercase tracking-wider text-white/40">{agent.role?.displayName}</span>
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-wider">{agent.displayName}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <button
                            onClick={() => setShowAllAgents((prev) => !prev)}
                            className="px-8 py-3 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all duration-300 cursor-pointer"
                        >
                            {showAllAgents ? 'Show Less ←' : 'View All Agents →'}
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══ MAPS ═══ */}
            <section ref={addSectionRef} className="relative py-24 px-4 sm:px-8 lg:px-16 overflow-hidden">
                {/* Background Video that changes on map hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f1923] to-[#1a2a3a]" />

                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h2 className="font-riot text-5xl sm:text-6xl md:text-7xl font-black uppercase text-white leading-[0.9] mb-3">Map</h2>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-4">Fight in All Parts of the World</h3>
                        <p className="text-white/40 text-sm max-w-xl leading-relaxed">
                            Each map is a playground to showcase your creative abilities. Multiple game modes, diverse locations, and dynamic environments ensure every match is unique.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {displayedMaps.map((map) => (
                            <Link
                                to={`/games/valorant/maps/${map.uuid}`}
                                key={map.uuid}
                                className="group relative rounded-lg overflow-hidden cursor-pointer h-48 md:h-64 transition-all duration-300 hover:scale-[1.02] block element-focus" // Added 'block' for correct Link rendering
                            >
                                <img src={map.splash} alt={map.displayName}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 group-hover:opacity-70 transition-all duration-700" />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                <div className="absolute bottom-4 left-4 pointer-events-none">
                                    <p className="text-xs uppercase tracking-widest text-white/50 mb-1">{map.tacticalDescription}</p>
                                    <h3 className="text-2xl font-black uppercase tracking-wider">{map.displayName}</h3>
                                    {map.coordinates && (
                                        <p className="text-[10px] text-white/30 mt-1 font-mono">{map.coordinates}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <button
                            onClick={() => setShowAllMaps((prev) => !prev)}
                            className="px-8 py-3 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all duration-300 cursor-pointer"
                        >
                            {showAllMaps ? 'Show Less ←' : 'View All Maps →'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ValorantPage;
