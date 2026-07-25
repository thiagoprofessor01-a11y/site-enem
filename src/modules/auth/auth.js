"use client";

import { useEffect, useState } from "react";

// -------------------------------------------------------------------------
// Autenticação de TESTE (client-side).
//
// Contas fixas para você testar o fluxo agora. A segurança real virá com o
// Supabase Auth (cadastro/login de verdade) + a confirmação de pagamento do
// Mercado Pago marcando `pago = true`. Enquanto isso, estas contas fictícias
// permitem experimentar as áreas de admin e de aluno.
// -------------------------------------------------------------------------

const KEY = "meuenem:sessao";
const EVENTO = "meuenem:sessao-mudou";

// >>> CONTAS DE TESTE (troque/edite à vontade) <<<
export const CONTAS = [
  {
    email: "admin@meuenem.com",
    senha: "admin123",
    nome: "Administrador",
    role: "admin",
    pago: true,
  },
  {
    email: "aluno@teste.com",
    senha: "aluno123",
    nome: "Aluno Teste",
    role: "aluno",
    pago: true,
  },
];

export function login(email, senha) {
  const alvo = String(email || "").trim().toLowerCase();
  const conta = CONTAS.find((c) => c.email === alvo && c.senha === senha);
  if (!conta) return null;
  const sessao = {
    email: conta.email,
    nome: conta.nome,
    role: conta.role,
    pago: conta.pago,
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(sessao));
    window.dispatchEvent(new Event(EVENTO));
  }
  return sessao;
}

export function logout() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENTO));
  }
}

export function getSessao() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Hook de sessão reativo.
 * Retorna:
 *   undefined  → ainda carregando (evita divergência de hidratação)
 *   null       → ninguém logado
 *   objeto     → sessão do usuário logado
 */
export function useSessao() {
  const [sessao, setSessao] = useState(undefined);

  useEffect(() => {
    const ler = () => setSessao(getSessao());
    ler();
    window.addEventListener(EVENTO, ler);
    window.addEventListener("storage", ler);
    return () => {
      window.removeEventListener(EVENTO, ler);
      window.removeEventListener("storage", ler);
    };
  }, []);

  return sessao;
}
