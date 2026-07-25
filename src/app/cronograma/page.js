import Protegido from "@/modules/auth/Protegido";
import CronogramaClient from "@/modules/auth-cronograma/CronogramaClient";

// TIME A — Cronograma de estudos (área do aluno, protegida).
export default function CronogramaPage() {
  return (
    <Protegido>
      <CronogramaClient />
    </Protegido>
  );
}
