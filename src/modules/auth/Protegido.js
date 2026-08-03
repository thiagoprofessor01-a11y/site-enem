"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessao } from "./auth";

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
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    if (sessao === null) router.replace("/entrar");
  }, [sessao, router]);

  // Volta do checkout da Stripe (?session_id=...): confirma o pagamento e
  // libera o acesso na hora, sem depender do webhook chegar antes.
  useEffect(() => {
    if (!sessao || sessao.pago || sessao.role === "admin") return;
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    if (!sid) return;
    setConfirmando(true);
    fetch(`/api/stripe/confirm?session_id=${encodeURIComponent(sid)}`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (d.liberado) {
          window.location.replace(window.location.pathname); // recarrega já liberado
        } else {
          setConfirmando(false);
        }
      })
      .catch(() => setConfirmando(false));
  }, [sessao]);

  if (sessao === undefined) {
    return <Aviso><p className="text-slate-400">Carregando…</p></Aviso>;
  }

  if (sessao === null) {
    return <Aviso><p className="text-slate-400">Redirecionando para o login…</p></Aviso>;
  }

  if (confirmando) {
    return (
      <Aviso>
        <span className="text-4xl">⏳</span>
        <p className="mt-4 text-slate-500">Confirmando seu pagamento…</p>
      </Aviso>
    );
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
        <Link href="/#comprar" className="btn-primary mt-6">
          Ver planos — a partir de R$ 24,90
        </Link>
      </Aviso>
    );
  }

  return children;
}
