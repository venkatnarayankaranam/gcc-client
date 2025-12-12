export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#F4C542',
        darkgold: '#D4A017',
        black: '#000000',
        charcoal: '#1A1A1A',
        graysoft: '#2E2E2E',
        grayborder: 'rgba(244, 197, 66, 0.2)',
        goldglow: 'rgba(244, 197, 66, 0.4)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(244, 197, 66, 0.5)',
        'gold-glow-lg': '0 0 40px rgba(244, 197, 66, 0.6)',
        'gold-glow-sm': '0 0 10px rgba(244, 197, 66, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F4C542 0%, #D4A017 100%)',
        'dark-gradient': 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
        'charcoal-gradient': 'linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)',
      },
      fontFamily: {
        heading: ['Montserrat', 'Poppins', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244, 197, 66, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(244, 197, 66, 0.8)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(244, 197, 66, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(244, 197, 66, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
