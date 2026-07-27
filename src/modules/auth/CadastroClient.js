"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cadastrar, authFake } from "./auth";

// Calcula a idade a partir da data de nascimento (YYYY-MM-DD).
function idadeDe(nascimento) {
  if (!nascimento) return null;
  const hoje = new Date();
  const n = new Date(nascimento + "T00:00:00");
  let idade = hoje.getFullYear() - n.getFullYear();
  const m = hoje.getMonth() - n.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < n.getDate())) idade--;
  return idade;
}

const inputCls =
  "mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

export default function CadastroClient() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [consentimento, setConsentimento] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [aviso, setAviso] = useState("");

  const idade = idadeDe(nascimento);
  const menor = idade != null && idade < 18;

  const valido =
    nome.trim() &&
    email.trim() &&
    senha.length >= 6 &&
    nascimento &&
    (!menor || consentimento);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (menor && !consentimento) {
      setErro("Para menores de 18 anos, é necessário o consentimento de um responsável.");
      return;
    }
    setCarregando(true);
    try {
      const r = await cadastrar({ nome, email, senha, nascimento, consentimento });
      if (!r.ok) {
        setErro(r.erro || "Não foi possível criar a conta.");
        return;
      }
      if (r.precisaConfirmar) {
        setAviso("Conta criada! Verifique seu e-mail para confirmar antes de entrar.");
        return;
      }
      router.replace("/conteudos");
    } catch (err) {
      setErro("Não foi possível criar a conta. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  if (aviso) {
    return (
      <div className="container max-w-md py-16 text-center">
        <span className="text-4xl">📧</span>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Quase lá!</h1>
        <p className="mt-2 text-sm text-slate-600">{aviso}</p>
        <Link href="/entrar" className="btn-primary mt-6">Ir para o login</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-16">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl text-white">
          👤
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Criar conta</h1>
        <p className="mt-2 text-sm text-slate-600">
          Crie sua conta para acessar a plataforma.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6 sm:p-8">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Nome completo</span>
          <input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">E-mail</span>
          <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Senha</span>
          <input type="password" className={inputCls} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="mínimo 6 caracteres" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Data de nascimento</span>
          <input type="date" className={inputCls} value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
        </label>

        {menor && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <label className="flex items-start gap-2 text-sm text-amber-900">
              <input
                type="checkbox"
                checked={consentimento}
                onChange={(e) => setConsentimento(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-brand-600"
              />
              <span>
                Sou menor de 18 anos e declaro ter o <strong>consentimento do meu
                responsável legal</strong> para criar esta conta e usar a plataforma,
                conforme a{" "}
                <Link href="/privacidade" className="font-semibold underline">Política de Privacidade</Link>.
              </span>
            </label>
          </div>
        )}

        {erro && <p className="text-sm font-medium text-red-600">{erro}</p>}

        <button type="submit" disabled={!valido || carregando} className="btn-primary w-full disabled:opacity-60">
          {carregando ? "Criando conta…" : "Criar minha conta"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Já tem conta?{" "}
          <Link href="/entrar" className="font-semibold text-brand-600 hover:text-brand-700">Entrar</Link>
        </p>

        {authFake() && (
          <p className="rounded-lg bg-slate-100 px-3 py-2 text-center text-xs text-slate-500">
            Modo de teste (sem Supabase): a conta é criada só neste navegador.
          </p>
        )}
      </form>
    </div>
  );
}
