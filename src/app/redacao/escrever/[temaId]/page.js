import Protegido from "@/modules/auth/Protegido";
import PlaceholderPage from "@/components/PlaceholderPage";

// TIME C — Editor de redação para um tema específico (protegido)
export default function EscreverRedacaoPage({ params }) {
  return (
    <Protegido>
      <PlaceholderPage
        time="Time C"
        emoji="📄"
        titulo="Editor de redação"
        descricao={`Escrever redação sobre o tema #${params.temaId}, com contador de linhas/palavras (limite de 30 linhas).`}
      />
    </Protegido>
  );
}
