"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/modules/admin/admin-store";

// -------------------------------------------------------------------------
// Autenticação.
//
//  • Supabase configurado  → LOGIN DE VERDADE (Supabase Auth + tabela profiles).
//                            As contas fake NÃO funcionam.
//  • Supabase não configurado → contas fake (só para testar local/preview
//                            sem banco). Some automaticamente em produção.
//
// A interface (useSessao/login/logout/cadastrar) é a mesma nos dois casos:
// useSessao() retorna undefined (carregando) | null (deslogado) | objeto.
// -------------------------------------------------------------------------

const KEY = "meuenem:sessao";
const EVENTO = "meuenem:sessao-mudou";

// Modo fake ativo? (só quando não há Supabase configurado)
export function authFake() {
  return !isSupabaseConfigured();
}

// >>> CONTAS DE TESTE — só valem no modo fake (sem Supabase) <<<
export const CONTAS = [
  { email: "admin@meuenem.com", senha: "admin123", nome: "Administrador", role: "admin", pago: true },
  { email: "aluno@teste.com", senha: "aluno123", nome: "Aluno Teste", role: "aluno", pago: true },
];

/* ==================================================================== */
/* Modo fake (localStorage) — usado só quando não há Supabase           */
/* ==================================================================== */
function lerSessaoLocal() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function gravarSessaoLocal(sessao) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(sessao));
    window.dispatchEvent(new Event(EVENTO));
  }
}
function limparSessaoLocal() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENTO));
  }
}

/* ==================================================================== */
/* Perfil (role/pago/nome) a partir da tabela profiles                  */
/* ==================================================================== */
async function montarSessao(supabase, user) {
  if (!user) return null;
  const { data: perfil } = await supabase
    .from("profiles")
    .select("nome, role, pago")
    .eq("id", user.id)
    .single();
  return {
    email: user.email,
    nome: perfil?.nome || user.user_metadata?.nome || "",
    role: perfil?.role || "aluno",
    pago: perfil?.pago ?? false,
  };
}

/* ==================================================================== */
/* Ações                                                                */
/* ==================================================================== */
export async function login(email, senha) {
  const alvo = String(email || "").trim().toLowerCase();

  if (authFake()) {
    const conta = CONTAS.find((c) => c.email === alvo && c.senha === senha);
    if (!conta) return null;
    const sessao = { email: conta.email, nome: conta.nome, role: conta.role, pago: conta.pago };
    gravarSessaoLocal(sessao);
    return sessao;
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: alvo, password: senha });
  if (error || !data?.user) return null;
  await registrarDispositivo(supabase); // este vira o dispositivo ativo
  return montarSessao(supabase, data.user);
}

// ---- Uma conta = um dispositivo por vez ----
const DEVICE_KEY = "meuenem:dispositivo";

function novoToken() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
}

// Registra ESTE dispositivo como o ativo (grava um token no perfil e localmente).
async function registrarDispositivo(supabase) {
  if (authFake() || typeof window === "undefined") return;
  const token = novoToken();
  window.localStorage.setItem(DEVICE_KEY, token);
  await supabase.rpc("registrar_sessao", { p_token: token });
}

// true = este dispositivo ainda é o ativo; false = alguém logou em outro lugar.
export async function verificarSessaoAtual() {
  if (authFake()) return true;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return true; // ninguém logado aqui
  const { data } = await supabase
    .from("profiles")
    .select("sessao_atual")
    .eq("id", user.id)
    .single();
  if (!data?.sessao_atual) return true; // ainda não registrado
  const local = typeof window !== "undefined" ? window.localStorage.getItem(DEVICE_KEY) : null;
  return data.sessao_atual === local;
}

export async function cadastrar({ nome, email, senha, nascimento, consentimento }) {
  const alvo = String(email || "").trim().toLowerCase();

  if (authFake()) {
    const sessao = { email: alvo, nome: nome || "", role: "aluno", pago: false };
    gravarSessaoLocal(sessao);
    return { ok: true };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: alvo,
    password: senha,
    options: { data: { nome: nome || "" } },
  });
  if (error) return { ok: false, erro: error.message };

  // Completa o profile (criado pelo gatilho) com dados de LGPD.
  if (data?.user && (nascimento || consentimento != null)) {
    await supabase
      .from("profiles")
      .update({
        nascimento: nascimento || null,
        consentimento_responsavel: Boolean(consentimento),
      })
      .eq("id", data.user.id);
  }
  // Se já entrou direto (sem confirmar e-mail), registra o dispositivo.
  if (data?.session) await registrarDispositivo(supabase);
  // Sem sessão = precisa confirmar o e-mail antes de entrar.
  return { ok: true, precisaConfirmar: !data?.session };
}

export async function logout() {
  if (typeof window !== "undefined") window.localStorage.removeItem(DEVICE_KEY);
  if (authFake()) {
    limparSessaoLocal();
    return;
  }
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function excluirConta() {
  // Apaga os dados locais (cronograma/progresso) em qualquer modo.
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("meuenem:cronograma");
    window.localStorage.removeItem("meuenem:concluidas");
    window.localStorage.removeItem("meuenem:concluidas-questoes");
  }
  if (authFake()) {
    limparSessaoLocal();
    return;
  }
  // No modo real, encerra a sessão. A exclusão definitiva da conta no banco
  // exige uma rota no servidor (chave service_role) — a fazer.
  const supabase = createClient();
  await supabase.auth.signOut();
}

/* ==================================================================== */
/* Hook de sessão reativo                                               */
/* ==================================================================== */
export function useSessao() {
  const [sessao, setSessao] = useState(undefined);

  useEffect(() => {
    // ---- Modo fake ----
    if (authFake()) {
      const ler = () => setSessao(lerSessaoLocal());
      ler();
      window.addEventListener(EVENTO, ler);
      window.addEventListener("storage", ler);
      return () => {
        window.removeEventListener(EVENTO, ler);
        window.removeEventListener("storage", ler);
      };
    }

    // ---- Modo real (Supabase) ----
    const supabase = createClient();
    let ativo = true;

    const carregar = (user) => {
      montarSessao(supabase, user)
        .then((s) => ativo && setSessao(s))
        .catch(() => ativo && setSessao(null));
    };

    // Estado inicial + reação a login/logout.
    supabase.auth.getSession().then(({ data }) => {
      if (ativo) carregar(data.session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // defer para evitar deadlock ao chamar o supabase dentro do callback
      setTimeout(() => ativo && carregar(session?.user ?? null), 0);
    });

    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return sessao;
}
