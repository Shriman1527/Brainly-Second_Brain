/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        gray:{
          
          100:"#fefeff",
          200:"#f8fbfd",
          600:"#646a73"
        },
        purple:{
          200:"#dee7fe",
          500:"#6a65c7",
          600:"#5047e5"
        }
      }
    },
  },
  plugins: [],
}

