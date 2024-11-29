/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#0f1116',
          800: '#1a1d24',
          700: '#2a2d36',
          600: '#4b4f5a',
          400: '#9ca3af',
        },
        orange: {
          500: '#f97316',
          600: '#ea580c',
        },
        purple: {
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};