"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Tela de agradecimento pós-pagamento. Ao voltar do checkout com
// ?session_id=..., confirma na Stripe que a sessão foi paga (rede de
// segurança além do webhook) e mostra a confirmação.
export default function ObrigadoClient() {
  const [estado, setEstado] = useState("confirmando"); // confirmando | ok | pendente | erro

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setEstado("erro");
      return;
    }
    let ativo = true;
    fetch(`/api/stripe/confirm?session_id=${encodeURIComponent(sessionId)}`, {
      method: "POST",
    })
      .then((r) => r.json())
      .then((d) => {
        if (!ativo) return;
        if (d?.liberado) setEstado("ok");
        else if (d?.ok) setEstado("pendente");
        else setEstado("erro");
      })
      .catch(() => ativo && setEstado("erro"));
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="container flex min-h-[70vh] max-w-lg flex-col items-center justify-center py-16 text-center">
      {estado === "confirmando" && (
        <>
          <span className="text-4xl">⏳</span>
          <p className="mt-4 text-slate-500">Confirmando seu pagamento…</p>
        </>
      )}

      {estado === "ok" && (
        <div className="animate-fade-up w-full">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-acerto text-white shadow-lg">
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
            Pagamento confirmado!
          </h1>
          <p className="mt-3 text-slate-600">
            Seu acesso ao <strong>MeuENEM</strong> já está liberado. Bons estudos!
          </p>
          <Link href="/conteudos" className="btn-primary mt-8 inline-flex">
            Começar a estudar →
          </Link>
        </div>
      )}

      {estado === "pendente" && (
        <div className="animate-fade-up w-full">
          <span className="text-4xl">⏳</span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Pagamento em processamento</h1>
          <p className="mt-2 text-slate-600">
            Assim que o pagamento for confirmado, seu acesso é liberado automaticamente. Isso
            costuma levar só alguns instantes.
          </p>
          <Link href="/conteudos" className="btn-primary mt-8 inline-flex">
            Ir para a plataforma
          </Link>
        </div>
      )}

      {estado === "erro" && (
        <div className="animate-fade-up w-full">
          <span className="text-4xl">🔒</span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Não foi possível confirmar</h1>
          <p className="mt-2 text-slate-600">
            Se você concluiu o pagamento, seu acesso será liberado em instantes. Você também pode
            tentar entrar na plataforma.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/conteudos" className="btn-primary">
              Ir para a plataforma
            </Link>
            <Link href="/#comprar" className="btn-secondary">
              Ver planos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
