// Identidade visual de cada área de conhecimento (cores + emoji).
// As classes são escritas por extenso para o Tailwind incluí-las no build.
export const AREA_INFO = {
  matematica: {
    nome: "Matemática",
    emoji: "📐",
    grad: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    ring: "hover:border-blue-300",
    solid: "bg-blue-600",
  },
  natureza: {
    nome: "Ciências da Natureza",
    emoji: "🔬",
    grad: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    ring: "hover:border-emerald-300",
    solid: "bg-emerald-600",
  },
  humanas: {
    nome: "Ciências Humanas",
    emoji: "🌍",
    grad: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    ring: "hover:border-amber-300",
    solid: "bg-amber-600",
  },
  linguagens: {
    nome: "Linguagens e Códigos",
    emoji: "📖",
    grad: "from-fuchsia-500 to-purple-600",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    border: "border-fuchsia-200",
    ring: "hover:border-fuchsia-300",
    solid: "bg-fuchsia-600",
  },
  redacao: {
    nome: "Redação",
    emoji: "✍️",
    grad: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    ring: "hover:border-rose-300",
    solid: "bg-rose-600",
  },
};

export const ORDEM_AREAS = ["matematica", "natureza", "humanas", "linguagens", "redacao"];

// Retorna a identidade da área com um fallback neutro.
export function areaInfo(slug) {
  return (
    AREA_INFO[slug] || {
      nome: slug || "Área",
      emoji: "📚",
      grad: "from-slate-500 to-slate-600",
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      ring: "hover:border-slate-300",
      solid: "bg-slate-600",
    }
  );
}
