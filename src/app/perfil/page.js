import Protegido from "@/modules/auth/Protegido";
import PlaceholderPage from "@/components/PlaceholderPage";

// TIME A — Perfil do usuário (protegido)
export default function PerfilPage() {
  return (
    <Protegido>
      <PlaceholderPage
        time="Time A"
        emoji="⚙️"
        titulo="Perfil"
        descricao="Editar data do ENEM, horas disponíveis por dia e matérias com dificuldade."
      />
    </Protegido>
  );
}
