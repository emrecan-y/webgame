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
      },
    },
  },
  plugins: [],
};
