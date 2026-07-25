import MateriaClient from "@/modules/conteudos-dashboard/MateriaClient";

// TIME D — Página da matéria: módulos, aulas, resumos e videoaulas embutidas.
export default function MateriaPage({ params }) {
  return <MateriaClient materiaId={params.materiaId} />;
}
