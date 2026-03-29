import React from 'react';
import { FaDiscord, FaTwitter, FaYoutube, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative w-full bg-[#0a0f16] text-white/80 py-16 overflow-hidden border-t border-white/5">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                    src="/img/footer.jpg"
                    alt="Footer Background"
                    className="w-full h-full object-cover opacity-20 sepia-[0.2] hue-rotate-[-30deg]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f16] via-[#0a0f16]/90 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f16] via-transparent to-[#0a0f16]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 md:px-12">

                {/* 3 Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-16">

                    {/* Column 1: Address Info */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest shadow-black drop-shadow-md">Address info</h3>
                        <div className="flex flex-col gap-5 text-sm font-medium">
                            <div className="flex gap-4">
                                <FaMapMarkerAlt className="text-[#ff4655] text-lg shrink-0 mt-1" />
                                <p className="leading-relaxed">29th Street San Francisco, CA 60<br />94110 507-Union Trade Center, United States of America</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaPhoneAlt className="text-[#ff4655] text-lg shrink-0" />
                                <p>(+00) 123-456-789 60</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaEnvelope className="text-[#ff4655] text-lg shrink-0" />
                                <p>ranitbera090423@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest shadow-black drop-shadow-md">Quick Links</h3>
                        <ul className="flex flex-col gap-3 text-sm font-medium">
                            <li><Link to="/" className="hover:text-[#ff4655] transition-colors inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-[#ff4655]">▸</span><span className="group-hover:ml-3 transition-all">Home</span></Link></li>
                            <li><Link to="/games/valorant" className="hover:text-[#ff4655] transition-colors inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-[#ff4655]">▸</span><span className="group-hover:ml-3 transition-all">Games</span></Link></li>
                            <li><Link to="/news" className="hover:text-[#ff4655] transition-colors inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-[#ff4655]">▸</span><span className="group-hover:ml-3 transition-all">News</span></Link></li>
                            <li><Link to="/esport" className="hover:text-[#ff4655] transition-colors inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-[#ff4655]">▸</span><span className="group-hover:ml-3 transition-all">Esports</span></Link></li>
                            <li><Link to="/about" className="hover:text-[#ff4655] transition-colors inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-[#ff4655]">▸</span><span className="group-hover:ml-3 transition-all">About Us</span></Link></li>
                            <li><Link to="/profile" className="hover:text-[#ff4655] transition-colors inline-block relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all text-[#ff4655]">▸</span><span className="group-hover:ml-3 transition-all">My Profile</span></Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter & Social */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest shadow-black drop-shadow-md">Our Newsletter</h3>
                        <p className="text-sm font-medium leading-relaxed">There are many variations of passages of form humour or randomised</p>

                        <form className="relative mt-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your Mail"
                                className="w-full bg-white text-black px-4 py-3 pb-2.5 rounded-l border-none focus:outline-none font-medium placeholder:text-gray-500 pr-[100px]"
                                required
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 bottom-0 bg-[#ff4655] hover:bg-[#ff2033] text-white font-bold uppercase tracking-widest px-4 text-xs transition-colors rounded-r flex items-center"
                            >
                                Submit
                            </button>
                        </form>

                        <div className="flex items-center gap-5 mt-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-[#ff4655] hover:-translate-y-1 rounded-full transition-all duration-300 text-white">
                                <FaTwitter size={16} />
                            </a>
                            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-[#ff4655] hover:-translate-y-1 rounded-full transition-all duration-300 text-white">
                                <FaDiscord size={16} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-[#ff4655] hover:-translate-y-1 rounded-full transition-all duration-300 text-white">
                                <FaInstagram size={16} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-[#ff4655] hover:-translate-y-1 rounded-full transition-all duration-300 text-white">
                                <FaYoutube size={16} />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
                    <p className="text-sm font-medium text-white/50 text-center md:text-left">
                        Copyright &copy; 2026 @ranitbera09. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm font-medium text-white/50">
                        <a href="#privacy-policy" className="hover:text-[#ff4655] transition-colors">Privacy Policy</a>
                        <a href="#terms-of-service" className="hover:text-[#ff4655] transition-colors">Terms of Service</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
