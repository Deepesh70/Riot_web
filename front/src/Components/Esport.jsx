import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

const Esport = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Hero Animation
    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out',
    })
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .from('.hero-video', {
      scale: 1.2,
      opacity: 0,
      duration: 1.5,
      ease: 'expo.out',
    }, '-=1');

    // Scroll Animations for sections
    gsap.utils.toArray('.reveal-section').forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });

  }, { scope: containerRef });

  const tournaments = [
      { id: 1, title: 'VALORANT CHAMPIONS', date: 'AUG 2024', prize: '$2,250,000', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop' },
      { id: 2, title: 'LEAGUE WORLDS', date: 'OCT 2024', prize: '$5,000,000', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop' },
      { id: 3, title: 'MSI 2024', date: 'MAY 2024', prize: '$1,500,000', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165&auto=format&fit=crop' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          src="/videos/esport-1.mp4"
          loop
          muted
          autoPlay
          className="hero-video absolute top-0 left-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        
        <div className="relative z-20 text-center px-4">
          <h1 className="hero-title text-7xl md:text-9xl font-black uppercase tracking-tighter italic mb-4">
            Where Legends
          </h1>
          <h1 className="hero-title text-7xl md:text-9xl font-black uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Are Born
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl mt-8 font-light tracking-widest uppercase text-gray-300">
            The Next Generation of Competitive Gaming
          </p>
        </div>
      </section>

      {/* Featured Video Section */}
      <section className="reveal-section py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-5xl font-black uppercase mb-6 leading-tight">
                    Dominate <span className="text-blue-500">The Arena</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Experience the thrill of high-stakes competition. From local qualifiers to the world stage, every match writes a new chapter in esports history. Join millions of fans witnessing the evolution of tactical gameplay.
                </p>
                <button className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm">
                    Watch Live
                </button>
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/20 group">
                <video
                    src="/videos/feature-1.mp4"
                    loop
                    muted
                    autoPlay
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
            </div>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="reveal-section py-20 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-black uppercase mb-12 flex items-center gap-4">
                <span className="w-2 h-10 bg-red-600 block"></span>
                Major Tournaments
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
                {tournaments.map((t) => (
                    <div key={t.id} className="group relative h-[400px] overflow-hidden rounded-2xl cursor-pointer">
                        <img 
                            src={t.img} 
                            alt={t.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-300" />
                         
                         <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-red-500 font-bold tracking-widest text-sm mb-2">{t.date}</p>
                            <h3 className="text-3xl font-black uppercase italic mb-2 leading-none">{t.title}</h3>
                            <p className="text-gray-400 font-mono text-xs border-t border-gray-700 pt-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                PRIZE POOL: <span className="text-white">{t.prize}</span>
                            </p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Join Section */}
       <section className="reveal-section relative py-32 flex items-center justify-center overflow-hidden">
        <video
             src="/videos/feature-3.mp4"
             loop
             muted
             autoPlay
             className="absolute inset-0 w-full h-full object-cover opacity-20 hover:opacity-30 transition-opacity duration-700 scale-110"
        />
        <div className="relative z-10 text-center px-4">
             <h2 className="text-6xl md:text-8xl font-black uppercase italic mb-8">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Compete?</span>
             </h2>
             <button className="bg-red-600 text-white font-bold py-4 px-12 rounded-none hover:bg-red-700 transition-all uppercase tracking-widest text-lg skew-x-[-10deg] hover:skew-x-[-20deg] border-2 border-transparent hover:border-white">
                <span className="block skew-x-[10deg] hover:skew-x-[20deg]">Register Team</span>
             </button>
        </div>
       </section>

      <Footer />
    </div>
  );
};

export default Esport;
