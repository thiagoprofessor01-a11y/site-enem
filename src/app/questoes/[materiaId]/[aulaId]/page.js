import { redirect } from "next/navigation";

// Unificado com Conteúdos: a aula mostra vídeo + questões na mesma página.
export default function QuestoesAulaPage({ params }) {
  redirect(`/conteudos/${params.materiaId}/${params.aulaId}`);
}
