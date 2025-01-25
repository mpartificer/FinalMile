/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html", 
        "./src/**/*.{js,ts,jsx,tsx}",
    ], 
    theme: {
      extend: {fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },},
    },
    plugins: [require("daisyui")],
    daisyui: {
      themes: [{
        mytheme: {
          "primary": "#FFFFFF", // Change to white
          "secondary": "#F8F9FC", // Light gray for backgrounds
          "accent": "#3B82F6", // Blue for primary actions
          "neutral": "#6B7280", // Gray for text
          "base-100": "#1F2937", // Dark gray for headings
       },
    }],
  },
  }