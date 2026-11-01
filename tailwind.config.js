/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1c1712",
        paper: "#f4efe4",
        muted: "#a3988c",
        line: "#3a332b",
        ember: "#ff5a36",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 30px 80px rgba(0, 0, 0, 0.35)",
      },
    },
  },
};
