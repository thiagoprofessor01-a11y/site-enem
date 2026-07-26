// Ícones de linha (SVG) — substituem os emojis para um visual mais profissional.
const PATHS = {
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
  livro: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="1.5" />
      <line x1="9" y1="4" x2="9" y2="20" />
    </>
  ),
  lista: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="1.5" />
      <line x1="8.5" y1="9" x2="15.5" y2="9" />
      <line x1="8.5" y1="12.5" x2="15.5" y2="12.5" />
      <line x1="8.5" y1="16" x2="13" y2="16" />
    </>
  ),
  lapis: (
    <>
      <path d="M4 20h4L18.5 9.5l-4-4L4 16z" />
      <line x1="13" y1="7" x2="17" y2="11" />
    </>
  ),
  calendario: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="1.5" />
      <line x1="4" y1="9.5" x2="20" y2="9.5" />
      <line x1="9" y1="3" x2="9" y2="6" />
      <line x1="15" y1="3" x2="15" y2="6" />
    </>
  ),
  calculo: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <line x1="8" y1="7.5" x2="16" y2="7.5" />
      <line x1="8" y1="13" x2="11" y2="13" />
      <line x1="9.5" y1="11.5" x2="9.5" y2="14.5" />
      <line x1="13" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="11" y2="17" />
      <line x1="13" y1="17" x2="16" y2="17" />
    </>
  ),
  frasco: (
    <>
      <path d="M9 3v6l-4.2 8.4A2 2 0 0 0 6.6 20.4h10.8a2 2 0 0 0 1.8-3L15 9V3" />
      <line x1="8" y1="3" x2="16" y2="3" />
      <line x1="7" y1="14" x2="17" y2="14" />
    </>
  ),
  globo: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <ellipse cx="12" cy="12" rx="4" ry="8.5" />
      <line x1="3.5" y1="12" x2="20.5" y2="12" />
    </>
  ),
  raio: <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7z" />,
};

export default function Icon({ name, className = "h-5 w-5", strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  );
}
