import Protegido from "@/modules/auth/Protegido";
import RedacaoClient from "@/modules/redacao/RedacaoClient";

// TIME C — Redação: aulas + banco de temas (HTML colado), gerenciado pelo admin.
export default function RedacaoPage() {
  return (
    <Protegido>
      <RedacaoClient />
    </Protegido>
  );
}
