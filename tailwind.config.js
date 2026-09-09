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
        navy: {
          DEFAULT: '#1B2A4A',
          deep: '#121d33',
          dark: '#0c1424',
        },
        ink: {
          DEFAULT: '#14181F',
          muted: '#2a313d',
        },
        gold: {
          DEFAULT: '#B8924A',
          light: '#d4af65',
          dark: '#947234',
        },
        cream: {
          DEFAULT: '#F6F2E9',
          light: '#fcfaf6',
          dark: '#e6ded0',
        },
        passport: {
          green: '#3F6B4F',
          oxblood: '#7A3B34',
          amber: '#A6732E',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'gold': '0 0 20px -3px rgba(184, 146, 74, 0.25)',
        'passport': '0 4px 20px -2px rgba(20, 24, 31, 0.5)',
      }
    },
  },
  plugins: [],
}
