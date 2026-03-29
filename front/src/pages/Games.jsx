import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ValorantPage from './ValorantPage';



const Games = () => {
    const { game } = useParams();
    const navigate = useNavigate();
    const activeGame = game || 'valorant';

    return (
        <main className="min-h-screen bg-[#0f1923] overflow-x-hidden">
            <Navbar />


            {/* ═══ Game Content ═══ */}
            <div>
                {activeGame === 'valorant' && <ValorantPage />}
                {activeGame === 'league-of-legends' && (
                    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
                        <div className="text-center">
                            <h2 className="font-riot text-4xl sm:text-6xl md:text-7xl font-black uppercase mb-4"
                                style={{ background: 'linear-gradient(180deg, #c89b3c 0%, #785a28 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                League of Legends
                            </h2>
                            <p className="text-white/30 text-sm max-w-md mx-auto mb-8">
                                The League of Legends page is coming soon. Stay tuned for champion spotlights, patch notes, and esports updates.
                            </p>
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#c89b3c]/20 bg-[#c89b3c]/5 text-[#c89b3c] text-xs font-bold uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-[#c89b3c] animate-pulse" />
                                Coming Soon
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
};

export default Games;
