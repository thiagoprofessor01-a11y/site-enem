import Protegido from "@/modules/auth/Protegido";
import AulaClient from "@/modules/conteudos-dashboard/AulaClient";

export default function QuestoesAulaPage({ params }) {
  return (
    <Protegido>
      <AulaClient
        materiaId={params.materiaId}
        aulaId={params.aulaId}
        base="/questoes"
        titulo="Questões"
        modo="questoes"
      />
    </Protegido>
  );
}
