"use client";

import { useRouter } from "next/navigation";
import { useSessao } from "@/modules/auth/auth";
import { KIWIFY_CHECKOUT } from "@/lib/config";

// Botão inteligente de compra:
//  - visitante (sem login) → vai criar conta primeiro (assim o e-mail existe)
//  - aluno logado sem acesso → abre o checkout do Kiwify do plano escolhido
//  - aluno já pago / admin → vai direto para os conteúdos
export default function ComprarAcesso({ className = "", children = "Garantir meu acesso", plano = "mensal" }) {
  const sessao = useSessao();
  const router = useRouter();

  function comprar() {
    if (sessao === undefined) return; // ainda carregando a sessão

    if (!sessao) {
      // guarda o plano escolhido para retomar o checkout após o cadastro
      router.push(`/cadastro?plano=${plano}`);
      return;
    }
    if (sessao.pago || sessao.role === "admin") {
      router.push("/conteudos");
      return;
    }

    // Abre o checkout do Kiwify, com o e-mail do aluno pré-preenchido para que
    // o webhook consiga casar a compra com a conta e liberar o acesso.
    const base = KIWIFY_CHECKOUT[plano] || KIWIFY_CHECKOUT.mensal;
    const url = sessao.email ? `${base}?email=${encodeURIComponent(sessao.email)}` : base;
    window.location.href = url;
  }

  return (
    <button type="button" onClick={comprar} className={className}>
      {children}
    </button>
  );
}
