import PlaceholderPage from "@/components/PlaceholderPage";

// TIME D — Resumo do tópico + vídeos do YouTube (iframe)
export default function TopicoPage({ params }) {
  return (
    <PlaceholderPage
      time="Time D"
      emoji="🎬"
      titulo="Tópico"
      descricao={`Resumo do tópico #${params.topicoId} e vídeos do YouTube embutidos (iframe).`}
    />
  );
}
