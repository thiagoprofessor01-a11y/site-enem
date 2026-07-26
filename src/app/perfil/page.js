import Protegido from "@/modules/auth/Protegido";
import PerfilClient from "@/modules/auth/PerfilClient";

// TIME A — Perfil do usuário (protegido)
export default function PerfilPage() {
  return (
    <Protegido>
      <PerfilClient />
    </Protegido>
  );
}
