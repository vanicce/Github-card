/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/components/*.vue",
    "./src/*.vue",
    "./src/assets/*.svg",
    "./src/pages/*.vue"
],
  theme: {
    extend: {
      fontFamily: {
        'Prompt': ['Prompt']
      },
    },
  }
};
