import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Simplified AnimatedTitle - uses simple useEffect instead of complex context
const AnimatedTitle = ({ title, containerClass }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Simple animation: Fade in and slide up
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animated-word",
        { opacity: 0, transform: 'translate3d(0, 40px, 0) rotateY(10deg)' },
        {
          opacity: 1,
          transform: 'translate3d(0, 0, 0) rotateY(0deg)',
          ease: 'power2.out',
          stagger: 0.1, // Stagger the animation for each line
          scrollTrigger: {
             trigger: containerRef.current,
             start: '100 bottom',
             end: 'center bottom',
             toggleActions: 'play none none reverse',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`animated-title ${containerClass}`}>
      {title.split('<br />').map((line, index) => (
        <div
          key={index}
          className="flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3"
        >
          {line.split(' ').map((word, i) => (
            <span
              key={i}
              className="animated-word"
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;
