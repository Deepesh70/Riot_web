// Import animation libraries and React hooks
import { gsap } from "gsap"; // Main GSAP animation library
import { useEffect, useRef } from "react"; // React hooks for lifecycle and DOM references
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ScrollTrigger for scroll-based animations
import clsx from "clsx"; // Utility for conditionally joining CSS classes

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

/**
 * AnimatedTitle component - Creates animated text that reveals as user scrolls
 * 
 * @param {string} title - The title text, can include HTML tags (esp. <br /> and <b>)
 * @param {string} containerClass - Additional CSS classes for the container
 */
const AnimatedTitle = ({ title, containerClass }) => {
  // Reference to the container element for GSAP animations
  const containerRef = useRef(null);

  // Set up the animations when component mounts
  useEffect(() => {
    // Create a GSAP context for clean animation management
    const ctx = gsap.context(() => {
      // Create a timeline for the title animation
      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current, // Element that triggers animation
          start: "100 bottom", // Start when 100px of element enters bottom of viewport
          end: "center bottom", // End when center of element reaches bottom of viewport
          toggleActions: "play none none reverse", // Play on enter, reverse on exit
        },
      });

      // Animate each word from a 3D rotated state to normal
      titleAnimation.to(
        ".animated-word", // Target all words with this class
        {
          opacity: 1, // Fade in from transparent
          transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)", // Reset 3D transform
          ease: "power2.inOut", // Smooth easing for natural motion
          stagger: 0.02, // Slight delay between each word (20ms)
        },
        0 // Start at the beginning of the timeline
      );
    }, containerRef);

    // Clean up animations when component unmounts
    return () => ctx.revert();
  }, []);

    // Note: Title should be provided by parent component
   return (
    // Main container with reference for animations and combined CSS classes
    <div ref={containerRef} className={clsx("animated-title", containerClass)}>
      {/* Split the title by line breaks and render each line */}
      {title.split("<br />").map((line, index) => (
        <div
          key={index}
          className="flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3" // Flexbox center with responsive spacing
        >
          {/* Split each line into individual words */}
          {line.split(" ").map((word, idx) => (
            <span
              key={idx}
              className="animated-word text-3xl sm:text-4xl md:text-5xl lg:text-6xl" // Responsive font sizes
              dangerouslySetInnerHTML={{ __html: word }} // Allow HTML in words (for <b> tags)
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;