import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TiArrowBack } from 'react-icons/ti';
import { gsap } from 'gsap';

const API = import.meta.env.VITE_API_BASE_URL;

const MapDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mapData, setMapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchMap = async () => {
            try {
                const res = await fetch(`${API}/api/valorant/maps/${id}`);
                if (!res.ok) {
                    // Fallback to official API if backend route isn't ready
                    const fallbackRes = await fetch(`https://valorant-api.com/v1/maps/${id}`);
                    const fallbackData = await fallbackRes.json();
                    setMapData(fallbackData.data);
                } else {
                    const data = await res.json();
                    setMapData(data.data || data);
                }
            } catch (err) {
                console.error("Error fetching map details:", err);
                // Last resort fallback
                const fallbackRes = await fetch(`https://valorant-api.com/v1/maps/${id}`);
                const fallbackData = await fallbackRes.json();
                setMapData(fallbackData.data);
            } finally {
                setLoading(false);
            }
        };

        fetchMap();
    }, [id]);

    useEffect(() => {
        if (!loading && mapData && containerRef.current) {
            gsap.fromTo(
                containerRef.current.querySelectorAll('.animate-fade'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [loading, mapData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!mapData) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white flex-col">
                <h2 className="text-4xl font-riot mb-4">Map Not Found</h2>
                <button onClick={() => navigate('/games/valorant')} className="px-6 py-2.5 bg-gradient-to-r from-accent-primary to-blue-400 text-black rounded-full uppercase font-black text-xs">
                    Back to Maps
                </button>
            </div>
        );
    }

    // Collect all available images for the gallery
    const images = [
        { label: 'Splash', url: mapData.splash },
        { label: 'Stylized Background', url: mapData.stylizedBackgroundImage },
        { label: 'Premier Background', url: mapData.premierBackgroundImage },
        { label: 'List View', url: mapData.listViewIconTall },
        { label: 'Display Icon', url: mapData.displayIcon }
    ].filter(img => img.url);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-dark-900 text-white overflow-x-hidden font-sans">
            {/* Background Map/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-800 to-dark-900" />
            {mapData.splash && (
                <img
                    src={mapData.splash}
                    alt=""
                    className="absolute top-0 left-0 w-full h-[60vh] opacity-15 object-cover pointer-events-none"
                    style={{ filter: 'blur(4px)' }}
                />
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 animate-fade">
                    <button
                        onClick={() => navigate('/games/valorant')}
                        className="flex items-center gap-2 text-white/50 hover:text-accent-primary transition-colors cursor-pointer"
                    >
                        <TiArrowBack className="text-2xl" />
                        <span className="font-bold text-xs uppercase tracking-widest font-mono">Back to Maps</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-12 mt-4">
                    {/* Left: Info */}
                    <div className="w-full lg:w-1/3 animate-fade pt-10">
                        <p className="text-accent-primary text-xs font-bold uppercase tracking-[0.3em] mb-2 font-mono">Map Information</p>
                        <h1 className="font-riot text-6xl md:text-8xl font-black uppercase leading-[0.9] mb-4">
                            {mapData.displayName}
                        </h1>
                        <p className="text-xl font-medium text-white/70 mb-6 uppercase tracking-widest font-riot">
                            {mapData.tacticalDescription}
                        </p>

                        {mapData.coordinates && (
                            <div className="mb-8 p-4 bg-dark-800 border border-white/10 rounded-xl inline-block">
                                <p className="text-xs uppercase tracking-widest text-white/40 mb-1 font-mono">Coordinates</p>
                                <p className="font-mono text-lg text-accent-primary font-bold">{mapData.coordinates}</p>
                            </div>
                        )}

                        <div className="mt-8 border-t border-white/10 pt-8">
                            <p className="text-white/60 leading-relaxed text-sm">
                                {mapData.narrativeDescription || "Fight your way through a unique battlefield showcasing diverse environments and tactical opportunities. Master the layout to lead your team to victory."}
                            </p>
                        </div>
                    </div>

                    {/* Right: Gallery */}
                    <div className="w-full lg:w-2/3 animate-fade flex flex-col gap-6">
                        <h2 className="text-2xl font-riot uppercase tracking-wider mb-2">Visual Gallery</h2>

                        {/* Main Featured Image */}
                        {images.length > 0 && (
                            <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                                <img src={images[0].url} alt={images[0].label} className="w-full h-auto object-cover max-h-[500px]" />
                                <div className="absolute bottom-4 left-4 bg-dark-900/80 px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold backdrop-blur-md border border-white/10 font-mono text-accent-primary">
                                    {images[0].label}
                                </div>
                            </div>
                        )}

                        {/* Image Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {images.slice(1).map((img, idx) => (
                                <div key={idx} className="relative rounded-xl overflow-hidden border border-white/10 group cursor-pointer h-48 sm:h-64 hover:border-accent-primary/50 transition-all duration-300">
                                    <img
                                        src={img.url}
                                        alt={img.label}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-3 left-3 pointer-events-none">
                                        <p className="text-accent-primary text-[10px] font-bold uppercase tracking-widest font-mono">
                                            {img.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapDetails;
