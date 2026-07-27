"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessao } from "./auth";
import ComprarAcesso from "@/modules/pagamento/ComprarAcesso";

function Aviso({ children }) {
  return (
    <div className="container flex min-h-[60vh] max-w-md flex-col items-center justify-center py-16 text-center">
      {children}
    </div>
  );
}

/**
 * Protege uma página da área do aluno.
 * - Sem login  → redireciona para /entrar.
 * - Logado sem acesso pago → mostra aviso para comprar o acesso.
 * - Admin e alunos com `pago` → libera o conteúdo.
 */
export default function Protegido({ children }) {
  const sessao = useSessao();
  const router = useRouter();

  useEffect(() => {
    if (sessao === null) router.replace("/entrar");
  }, [sessao, router]);

  if (sessao === undefined) {
    return <Aviso><p className="text-slate-400">Carregando…</p></Aviso>;
  }

  if (sessao === null) {
    return <Aviso><p className="text-slate-400">Redirecionando para o login…</p></Aviso>;
  }

  if (!sessao.pago && sessao.role !== "admin") {
    return (
      <Aviso>
        <span className="text-4xl">🔒</span>
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Acesso não liberado
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Garanta seu acesso para desbloquear cronograma, questões, conteúdos e
          redação.
        </p>
        <ComprarAcesso className="btn-primary mt-6">
          Liberar meu acesso — R$ 47,90
        </ComprarAcesso>
      </Aviso>
    );
  }

  return children;
}
