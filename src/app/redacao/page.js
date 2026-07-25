import Protegido from "@/modules/auth/Protegido";
import PlaceholderPage from "@/components/PlaceholderPage";

// TIME C — Aulas de redação + banco de temas (protegido)
export default function RedacaoPage() {
  return (
    <Protegido>
      <PlaceholderPage
        time="Time C"
        emoji="✍️"
        titulo="Redação"
        descricao="Aulas básicas (estrutura dissertativa-argumentativa, as 5 competências, erros comuns) e banco de temas."
      />
    </Protegido>
  );
}
