import Protegido from "@/modules/auth/Protegido";
import AulaClient from "@/modules/conteudos-dashboard/AulaClient";

// TIME D — Página dedicada da aula: vídeo + questionário (área do aluno).
export default function AulaPage({ params }) {
  return (
    <Protegido>
      <AulaClient materiaId={params.materiaId} aulaId={params.aulaId} />
    </Protegido>
  );
}
