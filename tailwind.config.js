/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        digital: ['"Share Tech Mono"', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"VT323"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        split: {
          ahead: '#4ade80',     // green
          behind: '#f87171',    // red
          gold: '#fbbf24',      // gold/yellow
          aheadLosing: '#86efac',
          behindGaining: '#fca5a5',
        }
      }
    },
  },
  plugins: [],
}
