"use client";

import Link from "next/link";
import { useSessao, logout } from "@/modules/auth/auth";
import { PLANOS } from "@/lib/config";
import ComprarAcesso from "@/modules/pagamento/ComprarAcesso";
import Vendas from "@/components/Vendas";
import DashboardAluno from "@/modules/conteudos-dashboard/DashboardAluno";

// Tela que aparece para quem está logado mas ainda NÃO pagou: em vez de ver
// o painel (que parecia acesso liberado), vê a escolha de plano.
function PrecisaAssinar({ sessao }) {
  const primeiro = (sessao?.nome || "").trim().split(" ")[0];
  return (
    <div className="container flex min-h-[70vh] max-w-lg flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl">🔒</span>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
        {primeiro ? `Falta só um passo, ${primeiro}!` : "Falta só um passo!"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Sua conta está criada. Escolha um plano para liberar o acesso completo à plataforma.
      </p>

      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        {PLANOS.map((p) => (
          <ComprarAcesso
            key={p.id}
            plano={p.id}
            className={`flex flex-col items-center rounded-2xl px-6 py-5 text-base font-extrabold shadow-lg transition hover:-translate-y-0.5 hover:brightness-105 ${
              p.destaque ? "bg-meta text-brand-900" : "bg-brand-600 text-white"
            }`}
          >
            <span className="text-sm font-bold uppercase tracking-wide opacity-80">{p.nome}</span>
            <span className="mt-1 text-2xl">R$ {p.preco}</span>
            <span className="text-xs font-semibold opacity-80">{p.periodo}</span>
          </ComprarAcesso>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Pague com Pix, boleto ou cartão · cancele quando quiser
      </p>

      <div className="mt-6 flex items-center gap-4 text-sm">
        <Link href="/#recursos" className="font-semibold text-brand-600 hover:text-brand-700">
          Ver o que está incluso
        </Link>
        <span className="text-slate-300">·</span>
        <button onClick={() => logout()} className="font-medium text-slate-500 hover:text-slate-700">
          Sair
        </button>
      </div>
    </div>
  );
}

// Tela inicial: aluno pago vê o painel; logado sem pagar vê a escolha de plano;
// visitante vê a página de vendas.
export default function HomeRouter() {
  const sessao = useSessao();
  if (sessao && sessao.role) {
    if (sessao.pago || sessao.role === "admin") return <DashboardAluno />;
    return <PrecisaAssinar sessao={sessao} />;
  }
  return <Vendas />;
}
