// Logo Meu ENEM (brand book).
export default function Logo({ className = "h-9 w-auto" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-meuenem.png"
      alt="Meu ENEM"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}
