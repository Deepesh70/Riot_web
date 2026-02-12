import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {ScrollTrigger} from "gsap/all";
import { TiLocationArrow } from 'react-icons/ti';
import { useState, useRef, useEffect } from 'react';
// import VideoPreview from './VideoPreview';
import Button from './Button';

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Component
 * 
 * An immersive hero section featuring interactive video transitions and 3D effects.
 * This component displays a fullscreen video with interactive elements, transitions between
 * multiple videos, and provides visual loading feedback while videos are loading.
 */
const Hero = () => {
  // State to track current video index (1-4)
  const [currentIndex, setCurrentIndex] = useState(1);
  // State to track if user has clicked to trigger video transition
  const [hasClicked, setHasClicked] = useState(false);

  // Loading state management for videos
  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const totalVideos = 4;
  
  // Refs for DOM element access
  const nextVdRef = useRef(null);
  const miniVideoRef = useRef(null);
  
  /**
   * Increment loaded videos counter whenever a video loads
   * Used to track loading progress
   */
  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  /**
   * Set loading state to false when all videos except one have loaded
   * This ensures the UI becomes interactive fairly quickly
   */
  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos]);

  /**
   * Handle click on the mini video element
   * Triggers transition animation between videos
   */
  const handleMiniVdClick = () => {
    setHasClicked(true);

    // Cycle to next video index
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);

    const miniVideo = miniVideoRef.current;
    const miniRect = miniVideo.getBoundingClientRect();

    const videoElement = miniVideo.querySelector('video');
    if(!videoElement) return;

    // Create GSAP animation timeline
    const tl = gsap.timeline();

    // First, position the next video exactly over the mini video
    tl.set("#next-video-container", { 
      visibility: "visible",
      width: miniRect.width,
      height: miniRect.height,
      x: miniRect.left,
      y: miniRect.top,
      borderRadius: "12px",
      overflow: "hidden"
    });
    
    // Then animate it to fill the screen
    tl.to("#next-video-container", {
      width: "100vw",
      height: "100vh",
      x: 0,
      y: 0,
      borderRadius: 0,
      duration: 1,
      ease: "power2.inOut"
    });

    // Fade out the original mini video
    tl.to(miniVideo, {
      opacity: 0,
      duration: 0.5
    }, 0);
    
    // Fade in any content that should appear after the transition
    tl.to(".hero-content", {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.3");
  };

  /**
   * 3D tilt effect on mouse move
   * Creates an interactive, depth-based response when hovering over the mini video
   */
  const handleMouseMove = (e) => {
    if (!miniVideoRef.current) return;

    // Calculate relative mouse position within the element
    const { left, top, width, height } = miniVideoRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    // Calculate tilt angles based on mouse position
    const tiltX = (y - 0.5) * 30; // Tilt range: -15 to 15 degrees
    const tiltY = (0.5 - x) * 30; // Tilt range: -15 to 15 degrees

    // Apply 3D transform with perspective
    miniVideoRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
  };

  /**
   * Reset transform when mouse leaves the element
   */
  const handleMouseLeave = () => {
    if (miniVideoRef.current) {
      miniVideoRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(0.5)';
    }
  };

  /**
   * GSAP animation for video transitions
   * Triggered when currentIndex changes (user clicks to switch videos)
   */
  useGSAP(
    () => {
      if (hasClicked) {
        // Make the next video visible
        gsap.set("#next-video", { visibility: "visible" });
        
        // Scale up the next video to fill the screen
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVdRef.current.play(), // Start playing the video
        });
        
        // Animate the current video scaling for transition effect
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true, // Revert animations when dependencies change
    }
  );

  /**
   * GSAP animation for the video frame clip-path effect
   * Creates a dynamic shape for the hero section that responds to scrolling
   */
  useGSAP(() => {
    // Set initial clip-path and border radius
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 50% 10%",
    });
    
    // Animate the clip-path on scroll
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true, // Smooth animation tied to scroll position
      },
    });
  });

  /**
   * Helper function to get video source path based on index
   */
  const getVideoSrc = (index) => `/videos/hero-${index}.mp4`;

  return (
    <div className="relative min-h-dvh w-screen overflow-x-hidden overflow-y-auto">
      {/* Loading overlay - displays while videos are loading */}
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          {/* Three-body loading animation */}
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      {/* Main video container with clip-path effect */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          {/* Interactive mini video that triggers transitions */}
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleMiniVdClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={miniVideoRef}
                src={getVideoSrc((currentIndex % totalVideos) + 1)}
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>

          {/* Next video element - initially hidden, shown during transition */}
          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
          
          {/* Background video that's always visible */}
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        {/* Bottom-right "GAMING" text */}
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-100">
          G<b>A</b>MING
        </h1>

        {/* Hero content overlay with heading, text and button */}
        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            {/* "REDEFINE" heading with styled letter */}
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>e
            </h1>

            {/* Tagline text */}
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>

            {/* CTA Button */}
            <Button
              id="watch-trailer"
              title="Watch trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>

      {/* Duplicate "GAMING" text with different styling outside the main container */}
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black text-3xl ">
        G<b>A</b>MING
      </h1>
    </div>
  );
};

export default Hero;