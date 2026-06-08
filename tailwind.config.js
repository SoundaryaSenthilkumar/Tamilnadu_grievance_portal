/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0C3C78',
        secondary: '#F4B400',
        background: '#F5F7FA',
      },
    },
  },
  plugins: [],
}
