import { redirect } from "next/navigation";

// As questões foram unificadas dentro de cada aula em Conteúdos.
export default function QuestoesPage() {
  redirect("/conteudos");
}
