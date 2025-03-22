/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e2cc8',
          light: '#4552e3',
          lighter: '#888feb',
          dark: '#15229c',
          darker: '#0d1152',
        },
        background: '#ffffff',
        secondary: '#f1f5f9',
        'muted-foreground': '#64748b',
      },
    },
  },
  plugins: [],
} 