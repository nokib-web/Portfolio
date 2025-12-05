/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6", // a vibrant purple
        "background-light": "#FFFFFF",
        "background-dark": "#121212",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem", // 8px
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
