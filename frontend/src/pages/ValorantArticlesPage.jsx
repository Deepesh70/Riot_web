import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import { TiLocationArrow } from 'react-icons/ti';
import Footer from '../components/common/Footer';

const ArticleCard = ({ article }) => {
    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col bg-dark-800 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent-primary/50 hover:shadow-[0_0_30px_rgba(79,183,221,0.2)] md:col-span-1 hover:-translate-y-1"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={article.urlToImage || 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt062d3e18cfbf6ad8/64775d7b92bb6d289dbbe0df/Valorant_2023_E6A3_PlayVALORANT_ContentStack_1920x1080_Standard.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                    onError={(e) => {
                        e.target.src = 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt062d3e18cfbf6ad8/64775d7b92bb6d289dbbe0df/Valorant_2023_E6A3_PlayVALORANT_ContentStack_1920x1080_Standard.jpg';
                    }}
                />
                {/* Accent edge highlight */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6 flex flex-col flex-grow relative z-10 bg-dark-800">
                <div className="text-accent-primary font-black uppercase text-[10px] tracking-widest mb-3 font-mono">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                
                <h3 className="text-xl md:text-2xl font-black mb-3 text-white uppercase tracking-tighter leading-tight group-hover:text-accent-primary transition-colors line-clamp-2 font-riot">
                    {article.title}
                </h3>
                
                <p className="text-white/60 text-sm font-medium leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {article.description}
                </p>

                <div className="flex items-center text-[11px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-accent-primary transition-colors mt-auto">
                    Read Report <TiLocationArrow className="ml-2 text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
            </div>
            
            {/* Corner Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent-primary opacity-0 group-hover:opacity-100 transition-opacity z-20 m-2 rounded-br" />
        </a>
    );
};


const ValorantArticlesPage = () => {
    const [actualArticles, setActualArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchValorantNews = async () => {
            try {
                const res = await fetch(`https://newsdata.io/api/1/news?apikey=pub_YOUR_FREE_KEY&q=Valorant&language=en`);
                if (!res.ok) throw new Error('API Rate Limited or Missing Key');
                
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    const mappedData = data.results.map((item) => ({
                        title: item.title,
                        description: item.description || "Read more about this specific update on the official page.",
                        url: item.link,
                        urlToImage: item.image_url,
                        publishedAt: item.pubDate
                    }));
                    setActualArticles(mappedData);
                    setError(null);
                } else {
                    setActualArticles([]);
                    setError(null);
                }
            } catch (err) {
                setActualArticles([]);
                setError(err.message || 'Unable to load Valorant articles right now.');
            } finally {
                setLoading(false);
            }
        };

        fetchValorantNews();
    }, []);

    return (
        <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden pt-24 font-sans">
            <Navbar />

            <div className="px-4 sm:px-8 max-w-[1400px] mx-auto pb-24">
                
                {/* Header Section */}
                <div className="relative mb-16 pt-12 md:pt-20">
                    <div className="absolute -top-10 -left-10 text-[120px] md:text-[200px] font-black text-white/[0.02] select-none leading-none z-0 tracking-tighter font-riot">
                        NEWS
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-1 bg-accent-primary rounded-full" />
                                <span className="font-bold tracking-[0.2em] text-xs text-accent-primary uppercase">
                                    Archive
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] font-riot">
                                Valorant <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-blue-400">Articles</span>
                            </h1>
                        </div>
                        <p className="text-white/60 max-w-sm md:text-right font-medium leading-relaxed text-sm">
                            Stay up to date with the precise tactical updates, agent releases, and competitive esports breakthroughs across the globe.
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-accent-primary rounded-full animate-spin mb-4" />
                        <span className="font-bold uppercase tracking-widest text-xs text-white/50 font-mono">Decrypting Files...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-dark-800 px-6 py-16 text-center text-sm font-medium text-white/60">
                        {error}
                    </div>
                ) : actualArticles.length === 0 ? (
                    <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-dark-800 px-6 py-16 text-center text-sm font-medium text-white/60">
                        No Valorant articles are available right now.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {actualArticles.map((article, index) => (
                            <ArticleCard key={index} article={article} />
                        ))}
                    </div>
                )}
                
                {/* Visual Load More */}
                {!loading && !error && actualArticles.length > 0 && (
                    <div className="flex justify-center mt-16">
                        <button className="px-8 py-4 bg-dark-800 hover:bg-dark-700 border border-white/10 hover:border-accent-primary rounded-full transition-all duration-300 text-white hover:text-accent-primary font-bold uppercase tracking-widest text-xs cursor-pointer shadow-lg">
                            Load More Transmissions
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ValorantArticlesPage;
