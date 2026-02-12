import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { TiLocationArrow } from 'react-icons/ti';

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
                setError(err.message);
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
