"use client";

import { useState } from "react";
import Link from "next/link";
import { login, CONTAS, authFake } from "./auth";

/**
 * Formulário de login reutilizável.
 * onSucesso(sessao) é chamado quando o login dá certo (o pai decide o destino).
 */
export default function LoginForm({
  titulo = "Entrar",
  descricao = "Acesse sua conta para continuar.",
  onSucesso,
  mostrarDicas = true,
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const sessao = await login(email, senha);
      if (!sessao) {
        setErro("E-mail ou senha incorretos.");
        return;
      }
      onSucesso?.(sessao);
    } catch (err) {
      setErro("Não foi possível entrar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container max-w-md py-16">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl text-white">
          🔐
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
          {titulo}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{descricao}</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6 sm:p-8">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">E-mail</span>
          <input
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Senha</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>

        {erro && <p className="text-sm font-medium text-red-600">{erro}</p>}

        <button type="submit" disabled={carregando} className="btn-primary w-full disabled:opacity-60">
          {carregando ? "Entrando…" : "Entrar"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-brand-600 hover:text-brand-700">
            Criar conta
          </Link>
        </p>
      </form>

      {mostrarDicas && authFake() && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Contas de teste (temporárias)</p>
          <ul className="mt-2 space-y-1">
            {CONTAS.map((c) => (
              <li key={c.email}>
                <span className="font-medium">
                  {c.role === "admin" ? "Admin" : "Aluno"}:
                </span>{" "}
                <code className="rounded bg-white px-1">{c.email}</code> ·{" "}
                <code className="rounded bg-white px-1">{c.senha}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
