/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: false, // ✅ fully disables dark mode + oklch usage
  theme: {
    extend: {}
  },
  plugins: [],
};
