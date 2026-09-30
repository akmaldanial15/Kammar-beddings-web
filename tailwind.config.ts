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
          DEFAULT: '#102A4E', // Royal Midnight Navy Blue (Primary)
          dark: '#0A1A33',    // Deep Obsidian Midnight Blue (Headers, footers, dark backgrounds)
          light: '#1B3B6B',   // Royal Sapphire Accent Blue
          surface: '#102A4E0D', // Subtle 5% royal blue tint
        },
        gold: {
          DEFAULT: '#B49A58', // Muted Luxury Gold (Pairs regally with Royal Navy Blue)
          light: '#D4AF37',
          dark: '#937B3C',
          subtle: '#F6F8FC',
        },
        cream: {
          DEFAULT: '#F4F7FB', // Crisp pearl luxury white-blue background
          light: '#FAFCFE',
          dark: '#E5ECF4',
        },
        warmwhite: '#FFFFFF',
        charcoal: {
          DEFAULT: '#0F172A', // Deep slate primary text
          muted: '#475569',   // Slate secondary text
          light: '#334155',
        },
        borderLight: '#E2E8F0', // Slate border light
        sale: '#A13D40',     // Restrained sale accent
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(10, 26, 51, 0.04)',
        'card': '0 4px 20px rgba(10, 26, 51, 0.06)',
        'dropdown': '0 10px 30px rgba(10, 26, 51, 0.1)',
        'drawer': '-4px 0 25px rgba(10, 26, 51, 0.12)',
      },
      borderRadius: {
        'premium': '8px',
      },
    },
  },
  plugins: [],
}

export default config
