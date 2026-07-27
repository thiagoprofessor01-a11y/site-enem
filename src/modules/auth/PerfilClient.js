"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessao, excluirConta } from "./auth";

export default function PerfilClient() {
  const sessao = useSessao();
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);

  async function handleExcluir() {
    await excluirConta();
    router.replace("/");
  }

  return (
    <div className="container max-w-2xl py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Perfil</h1>
      <p className="mt-2 text-sm text-slate-500">
        Suas informações de conta.
      </p>

      <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Nome
          </p>
          <p className="mt-0.5 text-slate-800">{sessao?.nome || "—"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            E-mail
          </p>
          <p className="mt-0.5 text-slate-800">{sessao?.email || "—"}</p>
        </div>
      </div>

      {/* Excluir conta */}
      <div className="mt-12 border-t border-slate-100 pt-8">
        <h2 className="text-lg font-semibold text-slate-900">Excluir conta</h2>
        <p className="mt-1 text-sm text-slate-500">
          Isso apaga sua conta e todos os seus dados: cronograma e progresso das
          aulas. Esta ação não pode ser desfeita.
        </p>

        {confirmando ? (
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700">
              Tem certeza que deseja excluir sua conta?
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                onClick={handleExcluir}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Sim, excluir minha conta
              </button>
              <button
                onClick={() => setConfirmando(false)}
                className="text-sm font-semibold text-slate-500 transition hover:text-slate-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="mt-4 text-sm font-semibold text-red-600 transition hover:text-red-700"
          >
            Excluir minha conta
          </button>
        )}
      </div>
    </div>
  );
}
