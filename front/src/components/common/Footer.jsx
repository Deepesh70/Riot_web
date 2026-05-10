import React from 'react';
import { FaDiscord, FaTwitter, FaYoutube, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative w-full bg-dark-800 text-white/70 py-16 pb-24 md:pb-16 overflow-hidden border-t border-white/5">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                    src="/img/footer.jpg"
                    alt="Footer background texture"
                    className="w-full h-full object-cover opacity-10 sepia-[0.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-800/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-800 via-transparent to-dark-800" />
            </div>

            <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-6xl">

                {/* 3 Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-16">

                    {/* Column 1: Address Info */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-white uppercase tracking-widest">Address Info</h3>
                        <div className="flex flex-col gap-5 text-sm font-medium leading-relaxed">
                            <div className="flex gap-4">
                                <FaMapMarkerAlt className="text-accent-primary text-lg shrink-0 mt-1" />
                                <p>29th Street San Francisco, CA 94110<br />507-Union Trade Center, United States</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaPhoneAlt className="text-accent-primary text-lg shrink-0" />
                                <p>(+00) 123-456-789</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaEnvelope className="text-accent-primary text-lg shrink-0" />
                                <p>contact@riotgames.dev</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-white uppercase tracking-widest">Quick Links</h3>
                        <ul className="flex flex-col gap-3 text-sm font-medium">
                            <li><Link to="/" className="text-white/70 hover:text-accent-primary transition-colors duration-300 inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-accent-primary">▸</span><span className="group-hover:ml-3 transition-all">Home</span></Link></li>
                            <li><Link to="/games/valorant" className="text-white/70 hover:text-accent-primary transition-colors duration-300 inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-accent-primary">▸</span><span className="group-hover:ml-3 transition-all">Games</span></Link></li>
                            <li><Link to="/news" className="text-white/70 hover:text-accent-primary transition-colors duration-300 inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-accent-primary">▸</span><span className="group-hover:ml-3 transition-all">News</span></Link></li>
                            <li><Link to="/esport" className="text-white/70 hover:text-accent-primary transition-colors duration-300 inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-accent-primary">▸</span><span className="group-hover:ml-3 transition-all">Esports</span></Link></li>
                            <li><Link to="/about" className="text-white/70 hover:text-accent-primary transition-colors duration-300 inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-accent-primary">▸</span><span className="group-hover:ml-3 transition-all">About Us</span></Link></li>
                            <li><Link to="/profile" className="text-white/70 hover:text-accent-primary transition-colors duration-300 inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-accent-primary">▸</span><span className="group-hover:ml-3 transition-all">My Profile</span></Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Newsletter & Social */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-white uppercase tracking-widest">Newsletter</h3>
                        <p className="text-sm font-medium leading-relaxed text-white/60">Subscribe to stay updated with the latest Riot Games content</p>

                        <form className="relative mt-2 flex" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-white/5 text-white px-4 py-3 border border-white/10 rounded-l focus:outline-none focus:border-accent-primary font-medium placeholder:text-white/40 transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-accent-primary to-blue-400 hover:shadow-lg text-black font-bold uppercase tracking-widest px-6 text-xs transition-all duration-300 rounded-r hover:scale-105"
                            >
                                Subscribe
                            </button>
                        </form>

                        <div className="flex items-center gap-4 mt-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-accent-primary/20 hover:text-accent-primary hover:-translate-y-1 rounded-full transition-all duration-300 text-white/70 border border-white/10 hover:border-accent-primary/30">
                                <FaTwitter size={16} />
                            </a>
                            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-accent-primary/20 hover:text-accent-primary hover:-translate-y-1 rounded-full transition-all duration-300 text-white/70 border border-white/10 hover:border-accent-primary/30">
                                <FaDiscord size={16} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-accent-primary/20 hover:text-accent-primary hover:-translate-y-1 rounded-full transition-all duration-300 text-white/70 border border-white/10 hover:border-accent-primary/30">
                                <FaInstagram size={16} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-accent-primary/20 hover:text-accent-primary hover:-translate-y-1 rounded-full transition-all duration-300 text-white/70 border border-white/10 hover:border-accent-primary/30">
                                <FaYoutube size={16} />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-white/50 text-center md:text-left">
                        Copyright &copy; 2026 Riot Games Reimagined. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm font-medium text-white/50">
                        <a href="#privacy-policy" className="hover:text-accent-primary transition-colors duration-300">Privacy Policy</a>
                        <a href="#terms-of-service" className="hover:text-accent-primary transition-colors duration-300">Terms of Service</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
