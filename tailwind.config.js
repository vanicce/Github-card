/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#f5f5f7",
        canvas: "#09090b",
        muted: "#a1a1aa",
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
