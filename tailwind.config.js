/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Thmanyah Sans"', "system-ui", "sans-serif"],
        serif: ['"Thmanyah Serif Text"', "Georgia", "serif"],
        display: ['"Thmanyah Serif Display"', "Georgia", "serif"],
      },
      animation: {
        'gradient-shine': 'gradient-shine 4s linear infinite',
        'aurora': 'aurora 60s linear infinite',
        'border-spin': 'border-spin 4s linear infinite',
      },
      keyframes: {
        'gradient-shine': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        aurora: {
          from: { 'background-position': '0% 50%' },
          to: { 'background-position': '200% 50%' },
        },
        'border-spin': {
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}