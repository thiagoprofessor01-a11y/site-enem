import AdminGuard from "@/modules/auth/AdminGuard";

// Painel de administração — protegido por login de administrador.
export const metadata = {
  title: "Admin — MeuENEM",
};

export default function AdminPage() {
  return <AdminGuard />;
}
