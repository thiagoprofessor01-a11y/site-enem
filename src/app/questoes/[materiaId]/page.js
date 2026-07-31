import Protegido from "@/modules/auth/Protegido";
import MateriaClient from "@/modules/conteudos-dashboard/MateriaClient";

export default function QuestoesMateriaPage({ params }) {
  return (
    <Protegido>
      <MateriaClient
        materiaId={params.materiaId}
        base="/questoes"
        titulo="Questões"
        modo="questoes"
      />
    </Protegido>
  );
}
