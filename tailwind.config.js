/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html", 
        "./src/**/*.{js,ts,jsx,tsx}",
    ], 
    theme: {
      extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
      themes: [{
        mytheme: {
        "primary": "#1D1842",
        "secondary": "#8E0D3C",
        "accent": "#EF3B33",
        "neutral": "#FDA1A2",
        "base-100": "#FFFFFF",
       },
    }],
  },
  }