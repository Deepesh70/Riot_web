import React, { useEffect } from 'react'
import { useRef, useState } from 'react';
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useWindowScroll } from 'react-use';
import gsap from 'gsap';    

/**
 * Navigation items for the main menu
 * Each item will be rendered as a link with the same text as its anchor
 */
const NAV_ITEMS = [
    'Nexus', 'Vault', 'Prolugue', 'About', 'Contact'];

/**
 * Navbar Component
 * 
 * A responsive navigation bar with:
 * - Floating effect when scrolling
 * - Audio control button with animated indicators
 * - Transparent background at top, glassy black when scrolled
 * - Product button and navigation links
 * 
 * The navbar visibility is controlled by scroll direction - hides when scrolling down,
 * shows when scrolling up or at the top of the page.
 */
const Navbar = () => {
    // State for audio player control
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isIndicatorActive, setIsIndicatorActive] = useState(false);
    
    // Ref for navbar container element
    const navContainerRef = useRef(null);
    // Ref for audio element
    const audioElementRef = useRef(null);
    
    // Track scroll position and navbar visibility
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);

    // Get current scroll position using useWindowScroll hook
    const { y:currentScrollY } = useWindowScroll();    
    
    /**
     * Effect to handle scrolling behavior and add/remove floating navbar classes
     * - Shows navbar at top of page (currentScrollY === 0)
     * - Hides navbar when scrolling down
     * - Shows navbar when scrolling up
     * - Adds floating-nav class when not at the top
     */
    useEffect(() => {
        const navContainer = document.querySelector('header');
        const navElement = document.querySelector('nav');
        if (!navContainerRef.current || !navContainer || !navElement) return;
        
        if (currentScrollY === 0) {
            setIsNavVisible(true);
            navElement.classList.remove('floating-nav');
        } else if(currentScrollY > lastScrollY) {
            setIsNavVisible(false);
            navElement.classList.add('floating-nav');
        } else if(currentScrollY < lastScrollY) {
            setIsNavVisible(true);
            navElement.classList.add('floating-nav');
        }
        setLastScrollY(currentScrollY);
    }, [currentScrollY, lastScrollY]);    
    
    /**
     * Effect to animate navbar visibility using GSAP
     * Animates the Y position and opacity based on isNavVisible state
     */
    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100,
            opacity: isNavVisible ? 1 : 0,
            duration: 0.3,
            ease: "power2.out"
        })     
    }, [isNavVisible]);
    
    /**
     * Toggle audio playback and indicator animation state
     */
    const toggleAudioIndicator = () => {
        setIsAudioPlaying((prev) => !prev);
        setIsIndicatorActive((prev) => !prev);
    }
    
    /**
     * Effect to control audio playback based on isAudioPlaying state
     */
    useEffect(() => {
        if(isAudioPlaying){
            audioElementRef.current.play();
        }
        else{
            audioElementRef.current.pause();
        }     
    }, [isAudioPlaying]);    
    
    return (
        <header ref={navContainerRef} className='fixed top-0 left-0 z-50 w-full bg-transparent transition-all duration-300 px-4 py-2'>
            <nav className='flex size-full items-center justify-between p-4 rounded-xl bg-transparent'>
                {/* Left side: Logo and Products button */}
                <div className='flex items-center gap-7 '>            
                    <img src='/img/logo.png' alt='Logo' className='w-10' />
                    <Button 
                        id="product-button"
                        title="products"
                        rightIcon= {<TiLocationArrow/>}
                        containerClass= "bg-blue-50 flex items-center justify-center gap-1"
                    />
                </div>
                
                {/* Right side: Navigation links and audio control */}
                <div className='flex h-full items-center'>
                    {/* Navigation links - hidden on mobile */}
                    <div className='hidden md:block'>
                        {NAV_ITEMS.map((item) => (
                            <a 
                                key={item} 
                                href={`#${item.toLowerCase()}`} 
                                className='nav-hover-btn text-white font-semibold hover:text-yellow-300'
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                    
                    {/* Audio control button with animated indicators */}
                    <button 
                        className='ml-10 flex items-center space-x-0.5' 
                        onClick={toggleAudioIndicator}
                    >
                        {/* Hidden audio element controlled by the button */}
                        <audio ref={audioElementRef} className='hidden' src="/audio/loop.mp3" loop/>
                        
                        {/* Animated audio indicators/bars */}
                        {[1,2,3,4].map((bar) =>(
                            <div 
                                key={bar} 
                                className={`indicator-line ${isIndicatorActive ? "active" : ""}`} 
                                style={{animationDelay: `${bar*0.1}s`}}
                            />
                        ))}
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar;