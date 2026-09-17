/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          accent: '#06b6d4',
          neon: '#00f59b'
        },
        dark: {
          bg: '#0a0d14',
          surface: '#111726',
          card: '#161f33',
          border: '#232f4a',
          hover: '#1e2942'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        wave: {
          '0%': { height: '20%' },
          '100%': { height: '100%' }
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 245, 155, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 245, 155, 0.7)' }
        }
      }
    },
  },
  plugins: [],
}

