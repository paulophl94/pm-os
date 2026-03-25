/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nuvem': {
          primary: '#0066FF',
          secondary: '#00D4AA',
          dark: '#1a1a2e',
          light: '#f5f5f7',
        },
      },
    },
  },
  plugins: [],
}
