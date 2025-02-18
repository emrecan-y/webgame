/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "bounce-subtle": {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(-5%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
      animation: {
        "bounce-subtle": "bounce-subtle 1s linear infinite",
      },
      colors: {
        "game-accent-dark": "#2e1065",
        "game-accent-medium": "#5b21b6",
        "game-accent-light": "#a78bfa",
        "game-main-dark": "#030712",
        "game-main-medium": "#787e8f",
        "game-main-light": "#e5e7eb",

        "bir-red": "#c40c00",
        "bir-blue": "#0849a3",
        "bir-green": "#328a10",
        "bir-yellow": "#e7d004",
        "bir-black": "#000000",
        "bir-white": "#e2e2e2",
      },

      dropShadow: {
        "bir-small-text": [
          "-1.5px 1.2px rgba(0, 0, 0, 1)",
          "0 1px 1px rgba(0, 0, 0, 0.8)",
        ],
        "bir-large-text": [
          "-3px 2.5px rgba(0, 0, 0, 1)",
          "0 1.5px 1.5px rgba(0, 0, 0, 0.8)",
        ],
      },
      fontFamily: {
        cabin: ["Cabin", "sans-serif"],
      },
    },
  },
  plugins: [],
};
