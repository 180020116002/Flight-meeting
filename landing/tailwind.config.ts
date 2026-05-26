import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#FFB6C1',
        'editorial-dark': '#0A0A0B',
        'editorial-mid': '#111113',
        'accent': '#FFB6C1',
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        flyAcross: {
          '0%': { transform: 'translateX(-20%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0px)', opacity: '1' },
          '50%': { transform: 'translateY(-12px)', opacity: '1' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sinePath: {
          '0%': { transform: 'translateX(-20%) translateY(0px)' },
          '25%': { transform: 'translateX(15%) translateY(-18px)' },
          '50%': { transform: 'translateX(50%) translateY(0px)' },
          '75%': { transform: 'translateX(85%) translateY(-18px)' },
          '100%': { transform: 'translateX(120%) translateY(0px)' },
        },
        heroFloat: {
          '0%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-16px) rotate(2deg)' },
          '100%': { transform: 'translateY(0px) rotate(-2deg)' },
        },
        trailFade: {
          '0%': { opacity: '0.6', transform: 'scaleX(0.3)', transformOrigin: 'right' },
          '50%': { opacity: '0.3' },
          '100%': { opacity: '0.6', transform: 'scaleX(1)', transformOrigin: 'right' },
        },
      },
      animation: {
        'fly-across': 'flyAcross 3.5s ease-in-out infinite',
        'float-up': 'floatUp 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'sine-path': 'sinePath 4s ease-in-out infinite',
        'hero-float': 'heroFloat 5s ease-in-out infinite',
        'trail-fade': 'trailFade 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
