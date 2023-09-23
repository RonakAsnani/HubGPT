/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        // Define your custom colors for dark mode
        gray: {
          700: '#4a5568', // Example value for dark gray
        },
      },
    },
  },
  plugins: [],
}

