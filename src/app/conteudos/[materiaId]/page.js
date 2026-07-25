import Protegido from "@/modules/auth/Protegido";
import MateriaClient from "@/modules/conteudos-dashboard/MateriaClient";

// TIME D — Página da matéria (área do aluno, protegida).
export default function MateriaPage({ params }) {
  return (
    <Protegido>
      <MateriaClient materiaId={params.materiaId} />
    </Protegido>
  );
}
