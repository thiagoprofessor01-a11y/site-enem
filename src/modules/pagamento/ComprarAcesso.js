"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessao } from "@/modules/auth/auth";

// Botão inteligente de compra:
//  - visitante (sem login) → vai criar conta primeiro
//  - aluno logado sem acesso → inicia o checkout da Stripe
//  - aluno já pago / admin → vai direto para os conteúdos
export default function ComprarAcesso({ className = "", children = "Garantir meu acesso", plano = "mensal" }) {
  const sessao = useSessao();
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function comprar() {
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

    setCarregando(true);
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano }),
      });
      const data = await r.json();
      if (data.url) {
        window.location.href = data.url; // redireciona para o checkout da Stripe
      } else {
        alert(data.error || "Não foi possível iniciar o pagamento.");
        setCarregando(false);
      }
    } catch {
      alert("Erro ao iniciar o pagamento. Tente novamente.");
      setCarregando(false);
    }
  }

  return (
    <button type="button" onClick={comprar} disabled={carregando} className={className}>
      {carregando ? "Redirecionando…" : children}
    </button>
  );
}
