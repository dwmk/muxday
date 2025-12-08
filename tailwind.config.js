/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mux: {
          dark: '#050202',   // Matches your canvas background
          orange: '#ff7b00', // Matches your particle colors
          red: '#ff2a2a',    // Matches your particle colors
          gold: '#ffd700',   // Matches your gold accents
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};
