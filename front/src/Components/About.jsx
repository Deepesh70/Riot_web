// Import GSAP animation libraries
import gsap from "gsap"; // Main GSAP animation library
import { useGSAP } from "@gsap/react"; // React hook for GSAP
import { ScrollTrigger } from "gsap/all"; // ScrollTrigger plugin for scroll-based animations

// Import custom components
import AnimatedTitle from "./AnimatedTitle"; // Component for animating title text

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

/**
 * About component - Displays information about the gaming platform
 * Features a scroll-triggered animation that expands an image
 */
const About = () => {
  // Initialize GSAP animations when component mounts
  useGSAP(() => {
    // Create a timeline for the clip animation
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip", // Element that triggers the animation
        start: "center center", // Animation starts when center of element hits center of viewport
        end: "+=800 center", // Animation ends 800px after start point
        scrub: 0.5, // Smooth animation that follows scroll position with 0.5s delay
        pin: true, // Pin the element during the animation
        pinSpacing: true, // Maintain space in the document when element is pinned
      },
    });

    // Animation to expand the mask to full viewport size
    clipAnimation.to(".mask-clip-path", {
      width: "100vw", // Expand width to full viewport width
      height: "100vh", // Expand height to full viewport height
      borderRadius: 0, // Remove border radius for full rectangular shape
    });
  });
  return (
    // Main container with full width and minimum height of viewport
    <div id="about" className="min-h-screen w-screen">
      {/* Top content section with text and title */}
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        {/* Subtitle with responsive font size */}
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Zentry
        </p>

        {/* AnimatedTitle component with formatted HTML */}
        <AnimatedTitle
          title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure" // Special letters 'o' and 'a' are bold
          containerClass="mt-5 !text-black text-center" // Forced black text with center alignment
        />

        {/* Description text positioned based on CSS class */}
        <div className="about-subtext">
          <p>The Game of Games begins—your life, now an epic MMORPG</p>
          <p className="text-gray-500">
            Zentry unites every player from countless games and platforms, both
            digital and physical, into a unified Play Economy
          </p>
        </div>
      </div>

      {/* Animation container that's triggered on scroll */}
      <div className="h-dvh w-screen" id="clip">
        {/* Container that gets animated by GSAP */}
        <div className="mask-clip-path about-image">
          {/* Background image that expands during scroll */}
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover" // Positioned to fill container
          />
        </div>
      </div>
    </div>
  );
};

export default About;