import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
    { name: 'Marc Merrill', role: 'Co-Founder & President', color: '#ef4444' },
    { name: 'Brandon Beck', role: 'Co-Founder & Chairman', color: '#3b82f6' },
    { name: 'Anna Donlon', role: 'Head of VALORANT', color: '#a855f7' },
    { name: 'Joe Ziegler', role: 'Game Director', color: '#f97316' },
    { name: 'Ryan Scott', role: 'Lead Engineer', color: '#06b6d4' },
    { name: 'Naomi Park', role: 'Creative Director', color: '#10b981' },
    { name: 'David Nottingham', role: 'Narrative Lead', color: '#eab308' },
    { name: 'Trevor Romleski', role: 'Lead Designer', color: '#ec4899' },
];

const VALUES = [
    { icon: '⚡', title: 'Player First', desc: 'Every decision we make starts and ends with the player experience. We obsess over what makes games unforgettable.' },
    { icon: '🎯', title: 'Challenge Convention', desc: 'We question the status quo. If there\'s a better way to do something, we\'ll find it — even if it means starting over.' },
    { icon: '🤝', title: 'Thrive Together', desc: 'Great games are built by great teams. We foster collaboration, trust, and a shared passion for excellence.' },
    { icon: '🔥', title: 'Stay Hungry', desc: 'We\'re never satisfied. The drive to improve, iterate, and push boundaries is embedded in our DNA.' },
];

const STATS = [
    { number: '180M+', label: 'Monthly Players' },
    { number: '14+', label: 'Global Offices' },
    { number: '25+', label: 'Languages' },
    { number: '5000+', label: 'Rioters Worldwide' },
];

const TeamCard = ({ member, index }) => {
    const cardRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
        gsap.to(cardRef.current, { rotateY: x, rotateX: y, duration: 0.4, ease: 'power2.out' });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    }, []);

    const initials = member.name.split(' ').map(n => n[0]).join('');

    return (
        <div
            ref={cardRef}
            className="about-team-card group"
            style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-xl font-black text-white relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)` }}>
                <span className="relative z-10">{initials}</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${member.color}cc, transparent 70%)` }} />
            </div>
            <h3 className="text-white font-bold text-base text-center mb-1">{member.name}</h3>
            <p className="text-white/40 text-xs text-center tracking-wide">{member.role}</p>
            <div className="flex items-center justify-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </span>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </span>
            </div>
        </div>
    );
};

const AboutPage = () => {
    const containerRef = useRef(null);
    const cursorGlowRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (cursorGlowRef.current) {
                gsap.to(cursorGlowRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.8,
                    ease: 'power2.out',
                });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.about-label', { y: 30, opacity: 0, duration: 0.6 })
            .from('.about-hero-title', { y: 60, opacity: 0, duration: 0.9, stagger: 0.15 }, '-=0.3')
            .from('.about-hero-desc', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4');

        gsap.fromTo('.about-stat',
            { y: 40, opacity: 0 },
            { scrollTrigger: { trigger: '.about-stats', start: 'top 85%', once: true }, y: 0, opacity: 1, stagger: 0.1, duration: 0.7 }
        );

        gsap.fromTo('.about-story-content',
            { y: 60, opacity: 0 },
            { scrollTrigger: { trigger: '.about-story', start: 'top 85%', once: true }, y: 0, opacity: 1, duration: 0.9 }
        );

        gsap.fromTo('.about-value-card',
            { y: 50, opacity: 0 },
            { scrollTrigger: { trigger: '.about-values', start: 'top 85%', once: true }, y: 0, opacity: 1, stagger: 0.12, duration: 0.7 }
        );

        gsap.fromTo('.about-team-card',
            { y: 40, opacity: 0, scale: 0.95 },
            { scrollTrigger: { trigger: '.about-team', start: 'top 85%', once: true }, y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.6 }
        );

        gsap.fromTo('.about-join-content',
            { y: 50, opacity: 0 },
            { scrollTrigger: { trigger: '.about-join', start: 'top 85%', once: true }, y: 0, opacity: 1, duration: 0.8 }
        );

        gsap.utils.toArray('.about-parallax').forEach(el => {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
                y: -60,
            });
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans relative">

            {/* Cursor glow */}
            <div ref={cursorGlowRef} className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 hidden lg:block"
                style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)' }} />

            <Navbar />

            {/* ═══ HERO ═══ */}
            <section className="relative pt-40 pb-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="about-label text-red-500 text-xs font-bold uppercase tracking-[0.3em] mb-6">About Us</p>
                    <h1 className="about-hero-title text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] mb-6">
                        Hi. We're
                    </h1>
                    <h1 className="about-hero-title text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] mb-10">
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #ef4444, #f97316)' }}>Riot Games.</span>
                    </h1>
                    <p className="about-hero-desc text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-4">
                        We are a team of passionate gamers, developers, artists, and storytellers who believe the most meaningful entertainment comes from shared experiences.
                    </p>
                    <p className="about-hero-desc text-white/35 text-base max-w-xl mx-auto leading-relaxed">
                        From the <strong className="text-white/60">Rift</strong> to the <strong className="text-white/60">Arena</strong>, we create games and experiences
                        that forge connections and inspire players around the world.
                    </p>
                </div>

                {/* Decorative lines */}
                <div className="absolute top-20 left-10 w-px h-32 bg-gradient-to-b from-transparent via-red-500/20 to-transparent about-parallax" />
                <div className="absolute top-40 right-14 w-px h-48 bg-gradient-to-b from-transparent via-white/5 to-transparent about-parallax" />
            </section>

            {/* ═══ STATS BAR ═══ */}
            <section className="about-stats py-16 border-y border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((s, i) => (
                        <div key={i} className="about-stat text-center">
                            <p className="text-4xl md:text-5xl font-black text-white mb-2">{s.number}</p>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ OUR STORY ═══ */}
            <section className="about-story py-28 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="about-story-content grid md:grid-cols-2 gap-16 items-start">
                        <div>
                            <p className="text-red-500 text-xs font-bold uppercase tracking-[0.25em] mb-4">How It Started</p>
                            <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] mb-0">Our</h2>
                            <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #ef4444, #f97316)' }}>Story</h2>
                        </div>
                        <div className="space-y-6 pt-2">
                            <p className="text-white/50 leading-relaxed">
                                <strong className="text-white">Riot Games</strong> was founded in 2006 by Brandon Beck and Marc Merrill, two avid gamers
                                who believed that the industry was ignoring the most important audience — the players themselves.
                            </p>
                            <p className="text-white/40 leading-relaxed">
                                What started as a bold bet on a single game — League of Legends — grew into a global movement.
                                Today, we serve over 180 million players across the world with titles like VALORANT, Teamfight Tactics,
                                Legends of Runeterra, and Wild Rift.
                            </p>
                            <p className="text-white/40 leading-relaxed">
                                Our mission remains the same: to be the most player-focused game company in the world. Every pixel,
                                every line of code, every story we tell is in service of the players who make this all worthwhile.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ VIDEO SHOWCASE ═══ */}
            <section className="relative py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative rounded-3xl overflow-hidden h-[50vh] md:h-[60vh] about-parallax" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                        <video
                            src="/videos/feature-1.mp4"
                            autoPlay loop muted playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0a0a 0%, transparent 40%, transparent 60%, #0a0a0a 100%)' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-white/60 text-sm font-bold uppercase tracking-[0.3em] mb-3">Our Universe</p>
                                <h3 className="text-4xl md:text-6xl font-black uppercase text-white">Built For Players</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ VALUES ═══ */}
            <section className="about-values py-28 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-red-500 text-xs font-bold uppercase tracking-[0.25em] mb-4">What Drives Us</p>
                        <h2 className="text-4xl md:text-5xl font-black uppercase">Our Values</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((v, i) => (
                            <div key={i} className="about-value-card p-7 rounded-2xl transition-all duration-400 group cursor-default"
                                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', border: '1px solid rgba(255,255,255,0.12)' }}>
                                <div className="text-3xl mb-5 transform group-hover:scale-110 transition-transform duration-300">{v.icon}</div>
                                <h3 className="text-white font-bold text-lg mb-3">{v.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ TEAM ═══ */}
            <section className="about-team py-28 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-red-500 text-xs font-bold uppercase tracking-[0.25em] mb-4">Riot Team</p>
                        <h2 className="text-4xl md:text-5xl font-black uppercase">Meet The Team</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {TEAM.map((member, i) => (
                            <TeamCard key={i} member={member} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ JOIN US CTA ═══ */}
            <section className="about-join relative py-28 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, #ea580c, #f97316, #fb923c)' }} />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)' }} />
                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center about-join-content">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-6">Join Us</h2>
                    <p className="text-white/80 text-lg mb-3">
                        We're always looking for passionate players and builders. If you are one, we might just click.
                    </p>
                    <p className="text-white/60 text-sm mb-10 max-w-xl mx-auto leading-relaxed">
                        Work from anywhere, competitive pay, world-class benefits, and a chance to shape the future of gaming.
                        Need we say more? Send over your profile, we'll be in touch sooner than you'd expect.
                    </p>
                    <a href="#" className="inline-block bg-white text-black font-bold text-sm uppercase tracking-[0.15em] px-10 py-4 rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg">
                        View Openings
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
