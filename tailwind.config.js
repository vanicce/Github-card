/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        canvas: "#f5f5f7",
        muted: "#6e6e73",
        line: "#d2d2d7",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 8px 30px rgba(0, 0, 0, 0.06)",
      },
    },
  },
};
