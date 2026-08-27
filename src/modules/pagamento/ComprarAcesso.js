"use client";

import { useRouter } from "next/navigation";
import { useSessao } from "@/modules/auth/auth";
import { KIWIFY_CHECKOUT } from "@/lib/config";

// Botão inteligente de compra (fluxo "paga primeiro, cadastra depois"):
//  - já pago / admin → vai direto para os conteúdos
//  - qualquer outro (logado sem acesso OU visitante) → vai DIRETO pro checkout
//    do Kiwify; a conta é criada depois, na tela de obrigado.
export default function ComprarAcesso({ className = "", children = "Garantir meu acesso", plano = "mensal" }) {
  const sessao = useSessao();
  const router = useRouter();

  function comprar() {
    if (sessao === undefined) return; // ainda carregando a sessão

    if (sessao && (sessao.pago || sessao.role === "admin")) {
      router.push("/conteudos");
      return;
    }

    // Vai direto para o pagamento. Se estiver logado, pré-preenche o e-mail
    // (ajuda o webhook a casar a compra). Se não, a pessoa informa no checkout
    // e usa o MESMO e-mail ao criar a conta depois.
    const base = KIWIFY_CHECKOUT[plano] || KIWIFY_CHECKOUT.mensal;
    const url = sessao?.email ? `${base}?email=${encodeURIComponent(sessao.email)}` : base;
    window.location.href = url;
  }

  return (
    <button type="button" onClick={comprar} className={className}>
      {children}
    </button>
  );
}
