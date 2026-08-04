import { redirect } from "next/navigation";

// Unificado com Conteúdos: a matéria abre a mesma lista de aulas.
export default function QuestoesMateriaPage({ params }) {
  redirect(`/conteudos/${params.materiaId}`);
}
