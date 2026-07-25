import Protegido from "@/modules/auth/Protegido";
import PlaceholderPage from "@/components/PlaceholderPage";

// TIME B — Modo simulado cronometrado (protegido)
export default function SimuladoPage() {
  return (
    <Protegido>
      <PlaceholderPage
        time="Time B"
        emoji="⏱️"
        titulo="Simulado"
        descricao="Várias questões com tempo cronometrado; resultado exibido apenas ao final."
      />
    </Protegido>
  );
}
