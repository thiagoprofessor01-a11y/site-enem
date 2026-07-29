// Escala visual de incidência: 1 a 5 bolinhas ("o quanto cai").
// Cor por nível: 1 = verde, 2-3 = amarelo, 4-5 = vermelho.
export default function NivelDots({ nivel = 0, tamanho = "sm", titulo = true }) {
  const n = Math.max(0, Math.min(5, Number(nivel) || 0));
  const px = tamanho === "lg" ? "h-2 w-2" : "h-1.5 w-1.5";
  const cor = n >= 4 ? "bg-red-500" : n >= 2 ? "bg-yellow-400" : "bg-green-500";
  return (
    <span
      className="inline-flex items-center gap-0.5 align-middle"
      title={titulo ? `Incidência ${n}/5 — o quanto cai na prova` : undefined}
      aria-label={`Incidência ${n} de 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`inline-block rounded-full ${px} ${i <= n ? cor : "bg-slate-200"}`}
        />
      ))}
    </span>
  );
}
