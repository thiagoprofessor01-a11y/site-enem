// Marca removida — apenas o nome em texto simples (sem logo/imagem).
export default function Logo({ className = "" }) {
  return (
    <span className={`text-lg font-bold tracking-tight text-black ${className}`}>
      MeuENEM
    </span>
  );
}
