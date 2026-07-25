// Escala visual de incidência: 1 a 5 bolinhas vermelhas ("o quanto cai").
export default function NivelDots({ nivel = 0, tamanho = "sm", titulo = true }) {
  const n = Math.max(0, Math.min(5, Number(nivel) || 0));
  const px = tamanho === "lg" ? "h-3 w-3" : "h-2.5 w-2.5";
  return (
    <span
      className="inline-flex items-center gap-1 align-middle"
      title={titulo ? `Incidência ${n}/5 — o quanto cai na prova` : undefined}
      aria-label={`Incidência ${n} de 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`inline-block rounded-full ${px} ${
            i <= n ? "bg-red-500" : "bg-slate-200"
          }`}
        />
      ))}
    </span>
  );
}
