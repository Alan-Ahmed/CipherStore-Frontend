/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#020204",    // Djupsvart
          dark: "#0a0a0f",     // Kort-bakgrund
          gray: "#1a1a2e",     // Borders
          blue: "#00ffff",     // Neon Cyan
          green: "#39ff14",    // Neon Green
          red: "#ff003c",      // Neon Red
        }
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 10px #00ffff, 0 0 20px #00ffff40',
        'neon-green': '0 0 10px #39ff14, 0 0 20px #39ff1440',
      }
    },
  },
  plugins: [],
}