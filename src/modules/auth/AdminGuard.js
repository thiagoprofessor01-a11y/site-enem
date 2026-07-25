"use client";

import Link from "next/link";
import { useSessao, logout } from "./auth";
import LoginForm from "./LoginForm";
import AdminApp from "@/modules/admin/AdminApp";

/**
 * Protege o painel /admin. Sem login de administrador, mostra o formulário
 * de login ali mesmo. Se logar com uma conta que não é admin, avisa.
 */
export default function AdminGuard() {
  const sessao = useSessao();

  if (sessao === undefined) {
    return <div className="container py-16 text-center text-slate-400">Carregando…</div>;
  }

  if (!sessao) {
    return (
      <LoginForm
        titulo="Área administrativa"
        descricao="Entre com uma conta de administrador para gerenciar o conteúdo."
      />
    );
  }

  if (sessao.role !== "admin") {
    return (
      <div className="container flex min-h-[60vh] max-w-md flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl">🚫</span>
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Sem permissão de administrador
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          A conta <strong>{sessao.email}</strong> não tem acesso ao painel.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={logout} className="btn-secondary">
            Sair
          </button>
          <Link href="/conteudos" className="btn-primary">
            Ir para os conteúdos
          </Link>
        </div>
      </div>
    );
  }

  return <AdminApp />;
}
