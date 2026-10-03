/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Newsreader', 'Georgia', 'Cambria', 'serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      colors: {
        ielts: {
          red: '#D91A2A',
          redHover: '#B81320',
          dark: '#1E293B',
          lightBg: '#F8FAFC',
          border: '#E2E8F0',
          paper: '#FAF9F6',
          paperMuted: '#F4F3EE',
        }
      }
    },
  },
  plugins: [],
}
