/** @type {import('tailwindcss').Config} */

// Identidade de marca removida: tudo em tons de cinza (preto e branco).
// Rampa neutra reutilizada por todas as famílias de cor usadas no código.
const bw = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  500: "#71717a",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b",
  950: "#0a0a0a",
};

const sistema = [
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "sans-serif",
];

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
        sans: sistema,
        display: sistema,
      },
      colors: {
        // Marca e todas as famílias cromáticas → escala de cinza
        brand: bw,
        blue: bw,
        emerald: bw,
        red: bw,
        green: bw,
        yellow: bw,
        amber: bw,
        orange: bw,
        violet: bw,
        rose: bw,
        teal: bw,
        // Cores personalizadas (antiga página de vendas) neutralizadas
        ink: "#18181b",
        paper: "#ffffff",
        coral: "#52525b",
        sun: "#a1a1aa",
        pink: "#52525b",
        grape: "#52525b",
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
