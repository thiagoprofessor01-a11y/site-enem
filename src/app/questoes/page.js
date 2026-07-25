import Protegido from "@/modules/auth/Protegido";
import PlaceholderPage from "@/components/PlaceholderPage";

// TIME B — Banco de questões com filtros + modo treino livre (protegido)
export default function QuestoesPage() {
  return (
    <Protegido>
      <PlaceholderPage
        time="Time B"
        emoji="📝"
        titulo="Banco de questões"
        descricao="Listagem com filtros (matéria, tópico, ano, dificuldade) e modo treino livre com gabarito comentado."
      />
    </Protegido>
  );
}
