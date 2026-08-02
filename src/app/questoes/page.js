import Protegido from "@/modules/auth/Protegido";
import ConteudosClient from "@/modules/conteudos-dashboard/ConteudosClient";

// Questões — mesma estrutura de Conteúdos (matéria → módulo → aula),
// mas cada aula abre o questionário em HTML.
export default function QuestoesPage() {
  return (
    <Protegido>
      <ConteudosClient
        base="/questoes"
        titulo="Questões"
        subtitulo="Pratique as questões por matéria, do que mais cai para o que menos cai."
        bannerKey="bannerQuestoes"
      />
    </Protegido>
  );
}
