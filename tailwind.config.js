/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // custom font (install via npm & import in your globals)
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },

      // color palette
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        secondary: {
          50: '#f5f5f4',
          100: '#e6e6e5',
          200: '#dcd8d5',
          300: '#ccc5bf',
          400: '#aea79e',
          500: '#968b81',
          600: '#837569',
          700: '#6e6157',
          800: '#5c514a',
          900: '#4f4640',
          950: '#2a2522',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // beach / sea theme
        sea: {
          50:  '#e0f7fa', 100: '#b2ebf2', 200: '#80deea',
          300: '#4dd0e1', 400: '#26c6da', 500: '#00bcd4',
          600: '#00acc1', 700: '#0097a7', 800: '#00838f',
          900: '#006064',
        },
        sand: {
          50:  '#fff8e1', 100: '#ffecb3', 200: '#ffe082',
          300: '#ffd54f', 400: '#ffca28', 500: '#ffc107',
          600: '#ffb300', 700: '#ffa000', 800: '#ff8f00',
          900: '#ff6f00',
        },
      },

      // custom keyframes & animations
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        // background wave scroll
        wave: {
          '0%':   { 'background-position-x': '0' },
          '100%': { 'background-position-x': '1000px' },
        },
        // floating bubbles
        float: {
          '0%':   { transform: 'translateY(0)',     opacity: '0.7' },
          '50%':  { transform: 'translateY(-20px)', opacity: '1'   },
          '100%': { transform: 'translateY(0)',     opacity: '0.7' },
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        wave:         'wave 10s linear infinite',
        float:        'float 4s ease-in-out infinite',
      },

      // z-index helper for sticky navbar
      zIndex: {
        sticky: '60',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
