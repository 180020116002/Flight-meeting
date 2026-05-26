/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,html}',
    './index.html',
    './settings.html'
  ],
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#FFB6C1',
        'pastel-blue': '#AEC6CF',
        'pastel-mint': '#B5EAD7',
        'pastel-peach': '#FFDAB9',
        'pastel-lavender': '#C3B1E1'
      },
      animation: {
        'flyby': 'flyby 6s ease-in-out forwards',
        'pill-float': 'pillFloat 0.5s ease-out forwards',
        'contrail-fade': 'contrailFade 1s ease-out forwards'
      },
      keyframes: {
        flyby: {
          '0%': { transform: 'translateX(-120%) translateY(0px)', opacity: '0' },
          '5%': { opacity: '1' },
          '50%': { transform: 'translateX(50vw) translateY(-30px)', opacity: '1' },
          '95%': { opacity: '1' },
          '100%': { transform: 'translateX(120vw) translateY(-10px)', opacity: '0' }
        },
        pillFloat: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' }
        },
        contrailFade: {
          '0%': { opacity: '0.8', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.3)' }
        }
      }
    }
  },
  plugins: []
}
