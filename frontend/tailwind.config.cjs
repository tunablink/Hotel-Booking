/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A192F',
          800: '#112240',
        },
        gold: {
          500: '#D4AF37',
          600: '#AA8C2C',
        }
      }
    },
  },
  plugins: [],
}
