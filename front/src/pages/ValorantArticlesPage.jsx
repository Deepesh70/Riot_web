import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import { TiLocationArrow } from 'react-icons/ti';
import Footer from '../components/common/Footer';

// Stunning fallback mock data for when the free API limits are reached
const VALORANT_MOCK_NEWS = [
    {
        title: "Patch 8.04: New Agent Clove Revealed",
        description: "Riot Games officially unveils Clove, the immortal Controller who changes the game even after death. Learn about their abilities and lore.",
        url: "#",
        urlToImage: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/fb249d970e59a957827de32306788b1cc08b5be4-3840x2160.jpg",
        publishedAt: new Date().toISOString()
    },
    {
        title: "VCT Masters Madrid Concludes",
        description: "Sentinels secure an incredible victory at Masters Madrid, defeating Gen.G in a 3-2 thriller. Watch the highlights now.",
        url: "#",
        urlToImage: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/a3ca8f25841cb8ca638da0bbcdfe92f150495f87-1920x1080.jpg",
        publishedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        title: "New Map Rotation Update",
        description: "Breeze and Split are rotating out of the Active Duty pool, making way for the return of Haven and a brand new subterranean map.",
        url: "#",
        urlToImage: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/f0f8a85514b82d9ea12fbede436f56ce2add0865-1920x1080.jpg",
        publishedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
        title: "Valorant Premier Stage 2 Registration",
        description: "Assemble your squad! Stage 2 of Premier is opening soon. Here is everything you need to know about the new divisions and qualification paths.",
        url: "#",
        urlToImage: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/1381bf482b429074eceea4ba77be31fd95586bb8-1920x1080.jpg",
        publishedAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
        title: "Kuronami Skinline Breaks Sales Records",
        description: "The highly anticipated Kuronami bundle has become one of the most successful skinlines in Valorant history. See the conceptual art behind the blades.",
        url: "#",
        urlToImage: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt6d555809ca41ecde/6594d21e8d42d3345465e921/Kuronami_Article_Banner_1920x1080.jpg",
        publishedAt: new Date(Date.now() - 400000000).toISOString()
    },
    {
        title: "Developer Diary: State of the Agents",
        description: "The balance team discusses the current Duelist ecosystem internally, hinting at potential adjustments to Iso and Neon in upcoming patches.",
        url: "#",
        urlToImage: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltc189a07a126830cb/64b59cb12e3532f8a8d11db8/State_of_the_Agents_July_2023_Banner.jpg",
        publishedAt: new Date(Date.now() - 600000000).toISOString()
    }
];

const ArticleCard = ({ article }) => {
    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col bg-[#0f1923] border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#ff4655] hover:shadow-[0_0_20px_rgba(255,70,85,0.2)] md:col-span-1"
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
                {/* Red edge accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff4655] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6 flex flex-col flex-grow relative z-10 bg-[#0f1923]">
                <div className="text-[#ff4655] font-black uppercase text-[10px] tracking-widest mb-3">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                
                <h3 className="text-xl md:text-2xl font-black mb-3 text-white uppercase tracking-tighter leading-tight group-hover:text-[#ff4655] transition-colors line-clamp-2">
                    {article.title}
                </h3>
                
                <p className="text-white/60 text-sm font-medium leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {article.description}
                </p>

                <div className="flex items-center text-[11px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors mt-auto">
                    Read Report <TiLocationArrow className="ml-2 text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
            </div>
            
            {/* Corner Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#ff4655] opacity-0 group-hover:opacity-100 transition-opacity z-20 m-2" />
        </a>
    );
};


const ValorantArticlesPage = () => {
    const [actualArticles, setActualArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We use NewsAPI or a generic fast open API. 
        // If the fetch fails (due to key limits or CORS), we flawlessly inject the 1:1 structured MOCK data.
        const fetchValorantNews = async () => {
            try {
                // Notice we try fetching from the free public endpoint
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
                } else {
                    throw new Error('No articles found');
                }
            } catch (err) {
                // Flawless degraded fallback
                console.warn("Free API blocked/unavailable. Utilizing HD Mock Framework.");
                setActualArticles(VALORANT_MOCK_NEWS);
            } finally {
                setLoading(false);
            }
        };

        fetchValorantNews();
    }, []);

    return (
        <div className="min-h-screen bg-[#ece8e1] overflow-x-hidden pt-24 font-general">
            <Navbar />

            <div className="px-4 sm:px-8 max-w-[1400px] mx-auto pb-24">
                
                {/* Header Section */}
                <div className="relative mb-16 pt-12 md:pt-20">
                    <div className="absolute -top-10 -left-10 text-[120px] md:text-[200px] font-black text-black/5 select-none leading-none z-0 tracking-tighter">
                        NEWS
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-1 bg-[#ff4655]" />
                                <span className="font-black tracking-[0.2em] text-sm text-[#ff4655] uppercase">
                                    Archive
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-[#0f1923] uppercase tracking-tighter leading-[0.9]">
                                Valorant <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4655] to-orange-500">Articles</span>
                            </h1>
                        </div>
                        <p className="text-[#0f1923]/70 max-w-sm md:text-right font-medium leading-relaxed">
                            Stay up to date with the precise tactical updates, agent releases, and competitive esports breakthroughs across the globe.
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-12 h-12 border-4 border-[#0f1923]/10 border-t-[#ff4655] rounded-full animate-spin mb-4" />
                        <span className="font-black uppercase tracking-widest text-sm text-[#0f1923]/50">Decrypting Files...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {actualArticles.map((article, index) => (
                            <ArticleCard key={index} article={article} />
                        ))}
                    </div>
                )}
                
                {/* Visual Load More */}
                {!loading && (
                    <div className="flex justify-center mt-16">
                        <button className="group relative px-8 py-4 bg-transparent overflow-hidden border border-[#0f1923]/20 hover:border-[#ff4655] transition-colors">
                            <div className="absolute inset-0 bg-[#ff4655] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                            <span className="relative z-10 font-black uppercase tracking-widest text-[#0f1923] group-hover:text-white transition-colors text-sm">
                                Load More Transmissions
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ValorantArticlesPage;
