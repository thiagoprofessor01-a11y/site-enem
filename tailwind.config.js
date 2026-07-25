/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/modules/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta base do site (ajuste conforme a identidade visual)
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          200: "#bce0ff",
          300: "#8ecdff",
          400: "#59b0ff",
          500: "#328fff",
          600: "#1b6ff5",
          700: "#1458e1",
          800: "#1747b6",
          900: "#193f8f",
        },
      },
    },
  },
  plugins: [],
};
