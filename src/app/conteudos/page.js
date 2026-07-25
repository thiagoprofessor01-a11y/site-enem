import Protegido from "@/modules/auth/Protegido";
import ConteudosClient from "@/modules/conteudos-dashboard/ConteudosClient";

// TIME D — Conteúdos por área (área do aluno, protegida).
export default function ConteudosPage() {
  return (
    <Protegido>
      <ConteudosClient />
    </Protegido>
  );
}
