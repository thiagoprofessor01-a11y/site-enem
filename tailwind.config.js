/** @type {import('tailwindcss').Config} */

// Identidade Meu ENEM (brand book).
// Azul ENEM #3028D0 · Azul profundo #17106F · Ciano #00C8FF
// Lilás #D7D3FF · Verde acerto #21B573 · Amarelo meta #FFC857
const brand = {
  50: "#eeecfd",
  100: "#dcd9fb",
  200: "#bcb6f6",
  300: "#9a90f0",
  400: "#6d5fe8",
  500: "#4a3fdd",
  600: "#3028d0", // Azul ENEM (principal)
  700: "#2820a8",
  800: "#1f1a85",
  900: "#17106f", // Azul profundo
  950: "#0f0a4d",
};

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
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "Arial", "sans-serif"],
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "Arial", "sans-serif"],
      },
      colors: {
        brand,
        // Acentos do brand book
        ciano: "#00c8ff",
        lilas: "#d7d3ff",
        acerto: "#21b573", // verde
        meta: "#ffc857", // amarelo
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
