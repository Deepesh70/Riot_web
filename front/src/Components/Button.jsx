import React from 'react'

/**
 * Button component - A customizable button with optional icons on both sides
 * 
 * @param {string} title - The text displayed on the button
 * @param {string} id - Unique identifier for the button
 * @param {ReactNode} rightIcon - Optional icon component to display on the right side
 * @param {ReactNode} leftIcon - Optional icon component to display on the left side
 * @param {string} containerClass - Additional CSS classes for the button container
 */
const Button = ({title, id, rightIcon, leftIcon, containerClass}) => {
  return (
    <button 
      id={id} 
      className={`group relative z-50 w-fit cursor-pointer overflow-hidden bg-white rounded-full px-7 py-3 text-black ${containerClass}`}
    >
      {/* Left icon if provided */}
      {leftIcon}     
      
      {/* Button text with custom styling */}
       <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
        <div>{title}</div>
      </span>
      
      {/* Right icon if provided */}
      {rightIcon}
    </button>
  )
}

export default Button