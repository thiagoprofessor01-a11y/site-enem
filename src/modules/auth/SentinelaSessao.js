"use client";

import { useEffect } from "react";
import { useSessao, logout, verificarSessaoAtual } from "./auth";

// Vigia a sessão: se a mesma conta logar em outro dispositivo, este aqui é
// deslogado automaticamente (uma conta = um dispositivo por vez).
export default function SentinelaSessao() {
  const sessao = useSessao();

  useEffect(() => {
    if (!sessao) return;
    let ativo = true;

    async function checar() {
      let ok = true;
      try {
        ok = await verificarSessaoAtual();
      } catch {
        return; // problema de rede: não desloga por engano
      }
      if (ativo && ok === false) {
        ativo = false;
        window.alert("Sua conta foi acessada em outro dispositivo. Por segurança, você foi desconectado aqui.");
        await logout();
        window.location.href = "/entrar";
      }
    }

    checar();
    const iv = setInterval(checar, 30000); // a cada 30s
    const onFocus = () => checar();
    window.addEventListener("focus", onFocus);
    return () => {
      ativo = false;
      clearInterval(iv);
      window.removeEventListener("focus", onFocus);
    };
  }, [sessao]);

  return null;
}
