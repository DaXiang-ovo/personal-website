import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        naruto: {
          orange: '#FF6B00',
          'orange-light': '#FF8C38',
          navy: '#0D1B2A',
          'navy-light': '#1A2E45',
          gold: '#FFD700',
          'gold-dark': '#C9A800',
          red: '#CC0000',
          white: '#F5F0E8',
        },
      },
      fontFamily: {
        ninja: ['Cinzel', 'serif'],
      },
      backgroundImage: {
        'scroll-pattern': "url('/images/scroll-bg.png')",
      },
    },
  },
  plugins: [],
} satisfies Config
