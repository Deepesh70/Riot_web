

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        riot: ['riot', 'sans-serif'],
        general: ['general', 'sans-serif'],
        'circular-web': ['circular-web', 'sans-serif'],
        'robert-medium': ['robert-medium', 'sans-serif'],
        'robert-regular': ['robert-regular', 'sans-serif'],
      },
      colors: {
        // Premium dark gaming palette
        'dark': {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
          600: '#222222',
        },
        // Desaturated accent colors (anti-slop)
        'accent': {
          primary: '#4FB7DD',    // Cool blue - desaturated
          secondary: '#5724FF',  // Violet - use sparingly
          tertiary: '#EDFF66',   // Yellow - reduced intensity
        },
        'brand': {
          50: '#DFDFF0',
          75: '#DFDFF2',
          100: '#F0F2FA',
          200: '#010101',
          300: '#4FB7DD',
        },
        violet: {
          300: '#5724FF',
        },
        yellow: {
          100: '#8E983F',
          300: '#EDFF66',
        },
        blue: {
          50: '#DFDFF0',
          75: '#DFDFF2',
          100: '#F0F2FA',
          200: '#010101',
          300: '#4FB7DD',
        },
      },
      // Spacing scale for consistency
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
      },
      // Better shadow system
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
      },
      // Typography scale improvements
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
    },
  },
  plugins: [],
}
