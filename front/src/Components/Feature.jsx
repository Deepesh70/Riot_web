import React, { useState, useRef } from 'react'
import { TiLocationArrow } from 'react-icons/ti';

/**
 * BentoTilt Component
 * 
 * Creates a 3D tilt effect based on mouse movement over an element.
 * This component adds an interactive hover effect similar to Apple's macOS "bento box" UI
 * where elements respond to mouse position with subtle 3D rotation.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child elements to be rendered with the tilt effect
 * @param {string} props.className - Additional CSS classes for styling
 */
const BentoTilt= ({ children , className= '' }) => {
    // State to track the current transform style based on mouse position
    const [transformStyle, setTransformStyle] = useState(0);
    // Reference to the DOM element for calculating mouse position
    const itemRef = useRef(null);   

    /**
     * Handles mouse movement over the element to create tilt effect
     * Calculates the relative position of the mouse within the element
     * and applies a 3D transform based on that position
     */
    const handleMouseMove = (e) => {
        if (!itemRef.current) return;

        // Get the element's position and dimensions
        const {left , top , width, height} = itemRef.current.getBoundingClientRect();

        // Calculate relative mouse position (0-1 range)
        const relativeX = (e.clientX - left) / width;
        const relativeY = (e.clientY -top) / height;

        // Calculate tilt angles based on mouse position
        // The multiplier (7) controls the intensity of the tilt
        const tiltX = (relativeY - 0.5 ) * 7;
        const tiltY = (relativeX - 0.5) * -7; // Inverted for natural feel
        
        // Build the 3D transform with perspective and scale
        const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.95, 0.95, 0.95)`;
        setTransformStyle(newTransform);
    }

    /**
     * Resets the transform style when mouse leaves the element
     */
    const handleMouseLeave = () => {
        setTransformStyle(0);
    }

    return (
        <div 
            className={className} 
            ref={itemRef} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave}
            style={{transform: transformStyle}}
        > 
            {children}
        </div>
    )
}

/**
 * BentoCard Component
 * 
 * A content card with video background and text overlay.
 * Used within the BentoTilt component to create interactive feature tiles.
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Source URL for the background video
 * @param {ReactNode} props.title - Title text/elements to display on the card
 * @param {string} props.description - Optional description text
 */
const BentoCard =({src, title, description}) => {
    return (
        <div className='relative size-full' >
            {/* Background video */}
            <video 
                src={src}
                loop 
                muted
                autoPlay
                className='absolute left-0 top-0 size-full object-cover object-center'
            />
            {/* Content overlay */}
            <div className='relative z-10 flex size-full flex-col justify-between p-5 text-blue-50'>
               <div>
                <h1 className='bento-title special-font'>{title}</h1>
                {/* Conditionally render description if provided */}
                {description && (
                    <p className='mt-3 max-w-64 text-xs md:text-base'>{description}</p>
                )}
               </div>
            </div>
            {title}
        </div>
    )
}

/**
 * Feature Component
 * 
 * A section showcasing different product features using an interactive bento grid layout.
 * Displays multiple BentoCard components with video backgrounds and information about each feature.
 * 
 * The layout uses a combination of grid and flex layouts to create a visually interesting arrangement,
 * with interactive hover effects provided by the BentoTilt component.
 */
const Feature = () => {
  return (
    <section className='bg-black pb-52'>
        <div className='container mx-auto px-3 md:px-10'>
            {/* Section header with introduction text */}
            <div className='px-5 py-32'>
                <p className='font-circular-web text-lg text-blue-50'>Into the Metagame</p>
               
                <p className='max-w-md font-circular-web text-lg text-blue-50 opacity-50'>
                    Immerse yourself in a rich and ever-expanding universe where a vibrant array 
                    of products converge into an interconnected overlay experience on your world.
                </p>
            </div>

            {/* Main feature showcase - full-width */}
            <BentoTilt className='border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]'>
                <BentoCard 
                    src="videos/feature-1.mp4"
                    title={<>radia<b>n</b>t</>}
                    description="A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adeventrue."
                />
            </BentoTilt>

            {/* Grid layout for remaining features */}
            <div className='grid h-[135vh] grid-cols-2 grid-rows-3 gap-7'>
                {/* Feature: zigma */}
                <BentoTilt className='bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2'>
                    <BentoCard
                        src="videos/feature-2.mp4"
                        title={<>zig<b>m</b>a</>}
                        description="An anime and gaming-inspired NFT collection - the IP prined for expansion." 
                    />
                </BentoTilt>

                {/* Feature: nexus */}
                <BentoTilt className='bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0'>
                    <BentoCard
                        src="videos/feature-3.mp4"
                        title={<>n<b>e</b>xus</>}
                        description="A gamified social hub, adding a new dimension of play to social interaction for Web3 communities."
                    />
                </BentoTilt>

                {/* Feature: azul */}
                <BentoTilt className='bento-tilt_1 me-14 md:col-span-1 md:me-0'>
                    <BentoCard
                        src="videos/feature-4.mp4"
                        title={<>az<b>u</b>l</>}
                        description="A cross-world AI Agent - elevating your gameplay to be more fun and productive."
                    />
                </BentoTilt>
                
                {/* "More coming soon" card */}
                <BentoTilt className='bento-tilt_2'>
                    <div className='flex size-full flex-col justify-between bg-violet-300 p-5'>
                        <h1 className='bento-title special-font max-w-64 text-black'>M<b>o</b>re co<b>m</b>ing s<b>o</b>on!</h1>
                        <TiLocationArrow className="m-5 scale-[5] self-end"/>
                    </div>
                </BentoTilt>

                {/* Additional video feature with no text */}
                <BentoTilt className='bento-tile_2'>
                    <video 
                        src='videos/feature-5.mp4'
                        loop
                        muted
                        autoPlay
                        className='size-full object-cover object-center'
                    />
                </BentoTilt>
            </div>
        </div>
    </section >
  )
}

export default Feature