import CronogramaClient from "@/modules/auth-cronograma/CronogramaClient";

// TIME A — Cronograma de estudos
// O aluno escolhe as horas por dia; o sistema calcula os dias até o ENEM
// a partir da criação. Ele pode apagar e criar um novo cronograma.
export default function CronogramaPage() {
  return <CronogramaClient />;
}
