/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#048bfb',    // color1
        secondary: '#7cc2fc',  // color2
        accent: '#043098',     // color3
        dark: '#025396',       // color4 (and 5)
      }
    },
  },
  plugins: [],
}
