import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mux: {
          bg: "#202225", // Deep dark
          surface: "#2f3136", // Panel background
          blurple: "#5865F2", // The Discord-like accent
          "blurple-hover": "#4752C4",
          success: "#3BA55C",
          danger: "#ED4245",
          text: "#dcddde",
          muted: "#72767d"
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'], // Important for IDE
      }
    },
  },
  plugins: [],
};
export default config;