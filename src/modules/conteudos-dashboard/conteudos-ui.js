// Identidade visual de cada área de conhecimento (cores + emoji).
// As classes são escritas por extenso para o Tailwind incluí-las no build.
export const AREA_INFO = {
  matematica: {
    nome: "Matemática",
    icon: "calculo",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    ring: "hover:border-blue-300",
    solid: "bg-blue-600",
    dot: "bg-blue-500",
  },
  natureza: {
    nome: "Ciências da Natureza",
    icon: "frasco",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    ring: "hover:border-emerald-300",
    solid: "bg-emerald-600",
    dot: "bg-emerald-500",
  },
  humanas: {
    nome: "Ciências Humanas",
    icon: "globo",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    ring: "hover:border-amber-300",
    solid: "bg-amber-600",
    dot: "bg-amber-500",
  },
  linguagens: {
    nome: "Linguagens e Códigos",
    icon: "livro",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    ring: "hover:border-violet-300",
    solid: "bg-violet-600",
    dot: "bg-violet-500",
  },
  redacao: {
    nome: "Redação",
    icon: "lapis",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    ring: "hover:border-rose-300",
    solid: "bg-rose-600",
    dot: "bg-rose-500",
  },
};

export const ORDEM_AREAS = ["matematica", "natureza", "humanas", "linguagens", "redacao"];

// Retorna a identidade da área com um fallback neutro.
export function areaInfo(slug) {
  return (
    AREA_INFO[slug] || {
      nome: slug || "Área",
      icon: "livro",
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      ring: "hover:border-slate-300",
      solid: "bg-slate-600",
      dot: "bg-slate-500",
    }
  );
}
