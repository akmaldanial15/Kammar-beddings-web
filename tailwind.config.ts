import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#153D32', // Deep forest
          dark: '#102B24',    // Dark forest
          light: '#1F4F42',
          surface: '#153D320D',
        },
        gold: {
          DEFAULT: '#B49A58', // Muted gold
          light: '#C7AF72',
          dark: '#937B3C',
          subtle: '#FAF6EE',
        },
        cream: {
          DEFAULT: '#F6F2E9', // Cream background
          light: '#FCFAF6',
          dark: '#ECE6D8',
        },
        warmwhite: '#FFFDFA',
        charcoal: {
          DEFAULT: '#202824', // Primary text
          muted: '#646D67',   // Secondary text
          light: '#424D47',
        },
        borderLight: '#E4E2DB',
        sale: '#A13D40',     // Restrained sale accent
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(16, 43, 36, 0.04)',
        'card': '0 4px 20px rgba(16, 43, 36, 0.06)',
        'dropdown': '0 10px 30px rgba(16, 43, 36, 0.1)',
        'drawer': '-4px 0 25px rgba(16, 43, 36, 0.12)',
      },
      borderRadius: {
        'premium': '8px',
      },
    },
  },
  plugins: [],
}

export default config
