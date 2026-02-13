import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { TiLocationArrow } from 'react-icons/ti';

const DUMMY_NEWS = [
    {
        title: "Major Update Coming for Valorant",
        description: "Riot Games teases a massive update for Valorant, introducing new agents and map changes that will shake up the competitive meta.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
        publishedAt: new Date().toISOString()
    },
    {
        title: "E-Sports Tournament Finals This Weekend",
        description: "Top teams from around the world gather for the ultimate showdown in the annual championship. Don't miss the action live on stream.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
        publishedAt: new Date().toISOString()
    },
    {
        title: "New Graphics Card Generation Revealed",
        description: "Tech giants unveil the next generation of graphics cards promising 2x performance in modern games and ray-tracing capabilities.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2000&auto=format&fit=crop",
        publishedAt: new Date().toISOString()
    },
    {
        title: "Indie Game Sensation Hits 1 Million Sales",
        description: "A small team's passion project has taken the gaming world by storm, reaching a major milestone in just under a month.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=900&auto=format&fit=crop",
        publishedAt: new Date().toISOString()
    },
     {
        title: "Cyberpunk 2077 DLC Reviews Are In",
        description: "The long-awaited expansion for Cyberpunk 2077 has finally arrived. Critics praise the new story and gameplay improvements.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2000&auto=format&fit=crop",
        publishedAt: new Date().toISOString()
    },
    {
         title: "The Future of Cloud Gaming",
         description: "Is cloud gaming really the future? We dive deep into the technology and what it means for hardware manufacturers.",
         url: "#",
         urlToImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
         publishedAt: new Date().toISOString()
    }
];

const NewsSection = ({ title, query, limit }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/news?q=${query}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }
                const data = await response.json();
                const validArticles = data.articles
                    .filter(article => article.urlToImage)
                    .slice(0, limit);

                setArticles(validArticles);
            } catch (err) {
                console.log("API failed, using dummy data");
                setArticles(DUMMY_NEWS.slice(0, limit));
                // setError(err.message); // Supress error to show dummy data
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [query, limit]);

    if (loading) {
        return (
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-blue-100 font-robert-regular border-l-4 border-blue-500 pl-4">{title}</h2>
                <div className="flex justify-center items-center h-48 bg-white/5 rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-100"></div>
                </div>
            </div>
        );
    }

    if (error) return null;

    return (
        <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-blue-100 font-robert-regular border-l-4 border-blue-500 pl-4 uppercase">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                    <a
                        key={index}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
                    >

                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={article.urlToImage}
                                alt={article.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-60" />
                            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-blue-300 border border-blue-500/30">
                                {new Date(article.publishedAt).toLocaleDateString()}
                            </div>
                        </div>


                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold mb-2 font-robert-regular text-blue-50 group-hover:text-yellow-300 transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-xs text-zinc-400 font-general line-clamp-3 mb-4 flex-grow">
                                {article.description}
                            </p>

                            <div className="flex items-center text-[10px] font-general uppercase tracking-widest text-blue-200 group-hover:text-blue-400 mt-auto">
                                Read Story <TiLocationArrow className="ml-1 text-sm" />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

const News = () => {
    return (
        <div className="min-h-screen bg-black text-blue-50">
            <Navbar />

            <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="special-font hero-heading text-blue-100 mb-2">
                        GAMING <b className="text-blue-75">NEWS</b>
                    </h1>
                    <p className="font-robert-regular text-lg text-blue-50/60 max-w-2xl mx-auto">
                        Curated stories from the world of gaming, esports, and tech.
                    </p>
                </div>

                <NewsSection title="Latest Headlines" query="gaming" limit={4} />
                <NewsSection title="Esports" query="esports" limit={3} />
                <NewsSection title="PlayStation" query="playstation" limit={3} />
                <NewsSection title="Xbox" query="xbox" limit={3} />
            </div>
        </div>
    );
};

export default News;
