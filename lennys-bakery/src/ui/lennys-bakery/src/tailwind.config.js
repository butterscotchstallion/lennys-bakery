/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/index.html"
  ],
  plugins: [
    require("postcss-import"),
    require("autoprefixer"),
  ],
}
