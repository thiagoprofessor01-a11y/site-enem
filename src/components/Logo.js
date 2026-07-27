// Logotipo do MeuENEM — recriado em SVG (nítido em qualquer tamanho).
// "MEU" menor + "ENEM" grande em navy, com o traço dourado por baixo.
export default function Logo({ className = "h-7 w-auto" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 100"
      role="img"
      aria-label="MeuENEM"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* traço dourado */}
      <path
        d="M110 84 C 190 98, 285 92, 350 60 L 350 66 C 285 96, 190 100, 112 90 Z"
        fill="#f4b51e"
      />
      {/* MEU (menor) */}
      <text
        x="2"
        y="66"
        fontFamily="var(--font-display), Arial, sans-serif"
        fontSize="46"
        letterSpacing="1"
        fill="#1e2749"
      >
        MEU
      </text>
      {/* ENEM (grande) */}
      <text
        x="108"
        y="72"
        fontFamily="var(--font-display), Arial, sans-serif"
        fontSize="72"
        fill="#1e2749"
      >
        ENEM
      </text>
    </svg>
  );
}
