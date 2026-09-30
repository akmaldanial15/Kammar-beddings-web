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
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 20px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translate3d(0, -18px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale3d(0.96, 0.96, 1)' },
          '100%': { opacity: '1', transform: 'scale3d(1, 1, 1)' },
        },
        slideInRight: {
          '0%': { transform: 'translate3d(100%, 0, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translate3d(-100%, 0, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -6px, 0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in-down': 'fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'float-slow': 'floatSubtle 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
