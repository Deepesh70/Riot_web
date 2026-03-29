import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TiArrowBack } from 'react-icons/ti';
import { gsap } from 'gsap';
import { agentVideos } from '../../agentVideos';

const API = import.meta.env.VITE_API_BASE_URL;

const AgentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAbility, setSelectedAbility] = useState(null);

    const containerRef = useRef(null);
    const portraitRef = useRef(null);
    const infoRef = useRef(null);

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const response = await fetch(`${API}/api/valorant/agents/${id}`);
                const data = await response.json();
                setAgent(data.data);
                if (data.data?.abilities?.length > 0) {
                    setSelectedAbility(data.data.abilities[0]);
                }
            } catch (error) {
                console.error('Error fetching agent details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgent();
    }, [id]);

    useEffect(() => {
        if (!loading && agent) {
            // GSAP Animations
            gsap.fromTo(portraitRef.current,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
            );

            gsap.fromTo(infoRef.current,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
            );
        }
    }, [loading, agent]);

    if (loading || !agent) {
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

    // Use agent's API gradient colors for styling
    const bgGradient = agent.backgroundGradientColors
        ? `linear-gradient(135deg, #${agent.backgroundGradientColors[0] || '1a1a2e'}40, #0f1923, #${agent.backgroundGradientColors[2] || '16213e'}40)`
        : 'linear-gradient(135deg, #1a1a2e40, #0f1923, #16213e40)';

    // Get the videos for this agent
    const agentVideosList = agentVideos[id];
    const defaultBgVideo = agentVideosList && agentVideosList.length > 0 ? agentVideosList[0] : null;

    // Determine the video to play based on the selected ability
    const getCurrentVideo = () => {
        if (!agentVideosList || !selectedAbility) return defaultBgVideo;
        const activeAbilities = agent.abilities.filter(a => a.slot !== 'Passive');
        const index = activeAbilities.findIndex(a => a.displayName === selectedAbility.displayName);
        if (index >= 0 && agentVideosList[index]) {
            return agentVideosList[index];
        }
        return defaultBgVideo;
    };

    const currentVideo = getCurrentVideo();

    return (
        <div ref={containerRef} className="relative min-h-screen bg-[#0f1923] text-white overflow-hidden flex items-center">
            {/* Background Map/Gradient */}
            <div className="absolute inset-0" style={{ background: bgGradient }} />

            {/* Background Video */}
            {currentVideo ? (
                <video
                    key={currentVideo}
                    src={currentVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-screen pointer-events-none transition-opacity duration-1000"
                    style={{ filter: 'grayscale(30%)' }}
                />
            ) : agent.background && (
                <img
                    src={agent.background}
                    alt=""
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[150%] opacity-10 object-cover pointer-events-none"
                    style={{ filter: 'grayscale(100%)' }}
                />
            )}

            {/* Frame border like the screenshot */}
            <div className="absolute inset-4 md:inset-8 border-4 border-[#ff4655] rounded-xl pointer-events-none opacity-80 mix-blend-screen" />

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-10 left-10 md:top-14 md:left-14 z-50 flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
                <TiArrowBack size={36} />
                <span className="font-bold uppercase tracking-widest text-sm hidden sm:block">Back</span>
            </button>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between min-h-[80vh] gap-10">

                {/* Agent Portrait (Left Side) */}
                <div ref={portraitRef} className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:-mr-10 xl:-mr-20 z-20">
                    <img
                        src={agent.fullPortrait}
                        alt={agent.displayName}
                        className="h-[50vh] sm:h-[60vh] lg:h-[85vh] object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                    />
                </div>

                {/* Agent Info (Right Side) */}
                <div ref={infoRef} className="w-full lg:w-1/2 flex flex-col justify-center max-w-xl z-20 mt-10 lg:mt-0">

                    {/* Header Info */}
                    <div className="mb-6 border-b border-white/10 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                            {agent.role?.displayIcon && (
                                <img src={agent.role.displayIcon} alt={agent.role?.displayName} className="w-5 h-5 brightness-200" />
                            )}
                            <h3 className="text-white/70 text-sm font-bold uppercase tracking-[0.4em]">
                                {agent.role?.displayName || 'Unknown Role'}
                            </h3>
                        </div>
                        <h1 className="font-riot text-7xl sm:text-8xl lg:text-[140px] font-black uppercase leading-[0.85] tracking-tighter"
                            style={{ textShadow: '4px 4px 0 #000' }}>
                            {agent.displayName}
                        </h1>
                    </div>

                    {/* Description */}
                    <p className="text-white/60 mb-10 leading-relaxed text-sm lg:text-base pr-8">
                        {agent.description}
                    </p>

                    {/* Abilities Section */}
                    {agent.abilities && agent.abilities.length > 0 && (
                        <div>
                            {/* Ability Icons Row */}
                            <div className="flex gap-4 mb-6">
                                {agent.abilities.map((ability, idx) => {
                                    const isSelected = selectedAbility?.displayName === ability.displayName;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedAbility(ability)}
                                            className={`relative w-14 h-14 p-2.5 border flex items-center justify-center rounded transition-all duration-300 ${isSelected
                                                ? 'border-[#ff4655] bg-[#ff4655] shadow-[0_0_20px_rgba(255,70,85,0.4)]'
                                                : 'border-white/20 bg-black/40 hover:border-white/60 hover:bg-black/80'
                                                }`}
                                        >
                                            {ability.displayIcon ? (
                                                <img
                                                    src={ability.displayIcon}
                                                    alt={ability.displayName}
                                                    className={`w-full h-full object-contain ${isSelected ? 'brightness-0 invert' : 'opacity-80'}`}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-white/50">?</div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Selected Ability Details */}
                            {selectedAbility && (
                                <div className="bg-black/60 border border-white/5 p-6 rounded-lg backdrop-blur-md relative overflow-hidden min-h-[200px]">
                                    {/* Red accent line */}
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#ff4655]" />

                                    <h4 className="text-white font-black uppercase tracking-widest mb-1 text-lg">
                                        {selectedAbility.displayName}
                                    </h4>
                                    <h5 className="text-[#ff4655] text-[10px] font-bold uppercase tracking-widest mb-3">
                                        Slot: {selectedAbility.slot}
                                    </h5>
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        {selectedAbility.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentDetails;
