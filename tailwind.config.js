/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        ielts: {
          red: '#D91A2A',
          redHover: '#B81320',
          dark: '#1E293B',
          lightBg: '#F8FAFC',
          border: '#E2E8F0',
        }
      }
    },
  },
  plugins: [],
}
