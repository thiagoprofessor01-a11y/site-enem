import Protegido from "@/modules/auth/Protegido";
import QuestoesClient from "@/modules/questoes/QuestoesClient";

// TIME B — Banco de questões por módulo (HTML colado), gerenciado pelo admin.
export default function QuestoesPage() {
  return (
    <Protegido>
      <QuestoesClient />
    </Protegido>
  );
}
