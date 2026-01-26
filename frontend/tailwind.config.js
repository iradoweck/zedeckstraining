/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          dark: "hsl(var(--color-primary-dark))",
        },
        secondary: "hsl(var(--color-secondary))",
        accent: "hsl(var(--color-accent))",
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))"
        },
        border: "hsl(var(--border))"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
