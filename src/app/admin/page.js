import AdminApp from "@/modules/admin/AdminApp";

// Painel de administração de conteúdo.
// Matéria → Módulo → Aula → (vídeos do YouTube + questionário).
export const metadata = {
  title: "Admin — MeuENEM",
};

export default function AdminPage() {
  return <AdminApp />;
}
