// Import necessary React libraries and components
import React, { useRef} from 'react'
import AnimatedTitle from './AnimatedTitle.jsx' // Import custom animated title component
import gsap from 'gsap'; // Import GSAP for animations
import Button from './Button.jsx'; // Import custom button component

// Story component definition
const Story = () => {
  // Create a reference for the image element to apply 3D effects
  const frameRef = useRef(null);

  // Handler for mouse leaving the image - resets the 3D rotation effect
  const handleMouseLeave = () => {
    const element = frameRef.current; // Get the referenced DOM element
    gsap.to(element, {
      duration: 0.5, // Animation takes 0.5 seconds
      rotationX: 0, // Reset X rotation to 0
      rotationY: 0, // Reset Y rotation to 0
      ease: "power2.inOut", // Use power2 easing for smooth animation
    })
  }

  // Handler for mouse movement over the image - creates 3D tilt effect
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e; // Get mouse position from event
    const element = frameRef.current; // Get the referenced DOM element
    if(!element) return; // Safety check if element doesn't exist

    // Calculate the position of the mouse relative to the element
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Find the center point of the element
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation values based on mouse position relative to center
    // Negative for rotateX creates a realistic "looking at" effect
    const rotateX = (y - centerY) / centerY * -10; // Scale by 10 degrees
    const rotateY = (x - centerX) / centerX * 10;  // Scale by 10 degrees

    // Apply 3D rotation effect using GSAP
    gsap.to(element, {
      duration: 0.3, // Quick animation for responsive feel
      rotationX: rotateX, // Apply calculated X rotation
      rotationY: rotateY, // Apply calculated Y rotation
      transformPerspective: 500, // Set perspective for 3D effect
      ease: "power2.inOut", // Use power2 easing for smooth movement
    })
  }
  
  return (
    // Main section container with full viewport height, black background and light blue text
    <section id="story" className='min-h-dvh w-screen bg-black text-blue-50'>
      {/* Flex container for content with full size and centered alignment */}
      <div className='flex size-full flex-col items-center py-10 pb-24'>
        {/* Subtitle with different text sizes based on viewport */}
        <p className='font-general text-sm uppercase md:text-[10px]'>The multiversal ip World</p>
        
        {/* Container for the title and image with relative positioning */}
        <div className='relative size-full'>
          {/* AnimatedTitle component with HTML formatting and special styling */}
          <AnimatedTitle
            title="The St<b>o</b>ry of <br /> a hidden real<b>m</b>" // Title with <b> for special styling
            sectionId="#story" // Connects to the section ID
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10" // Styling classes
          />

          {/* Container for story image with custom styling from index.css */}
          <div className='story-img-container'>
            {/* Mask div with clip-path for custom shape from index.css */}
            <div className='story-img-mask'>
              {/* Content container for positioning the image */}
              <div className='story-img-content'>
                {/* Image with 3D hover effect */}
                <img
                  ref={frameRef} // Connect to the ref for GSAP animations
                  onMouseLeave={handleMouseLeave} // Reset rotation when mouse leaves
                  onMouseUp={handleMouseLeave} // Reset rotation when mouse button released
                  onMouseEnter={handleMouseLeave} // Reset rotation when mouse enters (initial state)
                  onMouseMove={handleMouseMove} // Apply 3D effect based on mouse position
                  src="/img/entrance.webp" // Image source
                  alt="entrance" // Alt text for accessibility
                  className='object-contain' // Make image maintain aspect ratio
                />
              </div>
            </div>
          </div>
        </div>

        {/* Container for the text content and button, positioned below the image */}
        <div className='-mt-80 flex w-full justify-center md:-mt-64 md:me-44 md:justify-end'>
          {/* Inner container for text and button with responsive alignment */}
          <div className='flex h-full w-fit flex-col items-center md:items-start'>
            {/* Descriptive paragraph with responsive text alignment */}
            <p className='mt-3 max-w-sm text-center font-circular-web text-violet-50 md:text-start '>
              Where realms converge, lies Zentry and the boundless pillar. Discover its secrets and shape your fate amidst infinite opportunities.
            </p>
            {/* Call-to-action button */}
            <Button 
              id="realm-button" 
              title="discover prologue" 
              containerClass='mt-5' // Add top margin to button
            />
          </div>
        </div>  
      </div>
    </section>
  )
}

export default Story