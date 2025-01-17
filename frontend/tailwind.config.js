/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "game-accent-dark": "#2e1065",
        "game-accent-medium": "#5b21b6",
        "game-accent-light": "#a78bfa",
        "game-main-dark": "#030712",
        "game-main-medium": "#787e8f",
        "game-main-light": "#e5e7eb",

        "uno-red": "#c40c00",
        "uno-blue": "#0849a3",
        "uno-green": "#328a10",
        "uno-yellow": "#e7d004",
        "uno-black": "#000000",
        "uno-white": "#e2e2e2",
      },

      dropShadow: {
        "uno-small-text": "-2px 2px rgb(0, 0, 0)",
        "uno-large-text": "-4px 4px rgb(0, 0, 0)",
      },
    },
  },
  plugins: [],
};
