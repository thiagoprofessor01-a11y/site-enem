/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/modules/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1120px" },
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "ui-sans-serif",
          "system-ui",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Identidade visual do site — navy neutro da logo MeuENEM
        brand: {
          50: "#eef1f7",
          100: "#dae0ee",
          200: "#b7c3dd",
          300: "#8b9cc3",
          400: "#5f74a4",
          500: "#415888",
          600: "#2f426c",
          700: "#243354",
          800: "#1e2749",
          900: "#151d31",
        },
        // Paleta vibrante da página de vendas
        ink: "#1b1430",
        paper: "#fff6ee",
        coral: "#ff6a4d",
        sun: "#ffc93c",
        teal: "#10bfa5",
        pink: "#ff5d9e",
        grape: "#7b5cff",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 23 42 / 0.04), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
        "card-hover":
          "0 10px 25px -5px rgb(15 23 42 / 0.10), 0 8px 10px -6px rgb(15 23 42 / 0.06)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
