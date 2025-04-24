/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      transitionDuration: {
        '1500': '1500ms',
        '1800': '1800ms',
      },
      transitionDelay: {
        '300': '300ms',
        '600': '600ms',
        '1200': '1200ms',
      },
      colors: {
        PrimaryColor: "#f8fafc",     // Light background
        SecondaryColor: "#94a3b8",   // Medium tone for secondary elements
        DarkColor: "#334155",        // Dark blue-gray for primary elements
        ExtraDarkColor: "#0f172a",   // Deep blue-black for emphasis and headers
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
