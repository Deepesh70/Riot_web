import React from 'react'

const Button = ({ title, id, rightIcon, leftIcon, containerClass }) => {
  return (
    <button
      id={id}
      className={`group relative z-50 w-fit cursor-pointer overflow-hidden bg-white rounded-full px-7 py-3 text-black font-medium transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${containerClass}`}
    >
      {/* Hover background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

      {leftIcon}

      <span className="relative inline-flex overflow-hidden font-general text-xs uppercase tracking-wider">
        <div className="transition-transform duration-300 group-hover:translate-y-0">
          {title}
        </div>
      </span>

      {rightIcon}
    </button>
  )
}

export default Button