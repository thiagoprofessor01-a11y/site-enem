"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSessao, logout } from "@/modules/auth/auth";
import Logo from "@/components/Logo";

// Ordem (esquerda → direita): Cronograma, Conteúdos, Simulados, Resumos, Redação.
// As questões agora ficam dentro de cada aula em Conteúdos.
const LINKS_ALUNO = [
  { href: "/cronograma", label: "Cronograma" },
  { href: "/conteudos", label: "Conteúdos" },
  { href: "/simulados", label: "Simulados" },
  { href: "/resumos", label: "Resumos" },
  { href: "/redacao", label: "Redação" },
];

function PerfilBtn({ onClick, escuro }) {
  return (
    <Link
      href="/perfil"
      onClick={onClick}
      aria-label="Meu perfil"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
        escuro
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-brand-50 text-brand-700 hover:bg-brand-100"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
      </svg>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const sessao = useSessao();
  const [aberto, setAberto] = useState(false);

  const logado = Boolean(sessao && sessao.role);
  const isAdmin = logado && sessao.role === "admin";
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Tema escuro só na landing de vendas (visitante na home "/").
  const escuro = pathname === "/" && !logado;

  async function sair() {
    setAberto(false);
    await logout();
    router.replace("/");
  }

  // Links do menu (sem "Meu perfil" — ele virou o ícone no canto).
  const links = logado ? (isAdmin ? [{ href: "/admin", label: "Admin" }] : LINKS_ALUNO) : [];

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur transition-colors ${
        escuro
          ? "border-white/10 bg-brand-950/80"
          : "border-slate-200/80 bg-white/90"
      }`}
    >
      <nav className="container flex h-16 items-center gap-4">
        <Link href="/" onClick={() => setAberto(false)} className="flex shrink-0 items-center">
          <Logo className={`h-8 w-auto ${escuro ? "brightness-0 invert" : ""}`} />
        </Link>

        {/* Desktop — links centralizados */}
        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(l.href)
                  ? escuro
                    ? "bg-white/10 text-white"
                    : "bg-brand-50 text-brand-700"
                  : escuro
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop — ações à direita */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {logado ? (
            <>
              <PerfilBtn escuro={escuro} />
              <button
                onClick={sair}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  escuro
                    ? "border-white/20 text-white/80 hover:bg-white/10"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/entrar"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  escuro ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Entrar
              </Link>
              <Link
                href="/#comprar"
                className={`rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition ${
                  escuro
                    ? "bg-meta text-brand-900 hover:brightness-105"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
              >
                Quero meu acesso
              </Link>
            </>
          )}
        </div>

        {/* Mobile: perfil + ação + hambúrguer */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          {logado && <PerfilBtn escuro={escuro} onClick={() => setAberto(false)} />}
          {!logado && (
            <Link
              href="/#comprar"
              className={`rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ${
                escuro ? "bg-meta text-brand-900" : "bg-brand-600 text-white"
              }`}
            >
              Quero acesso
            </Link>
          )}
          <button
            onClick={() => setAberto((v) => !v)}
            aria-label="Menu"
            aria-expanded={aberto}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
              escuro ? "border-white/20 text-white" : "border-slate-200 text-slate-700"
            }`}
          >
            {aberto ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Painel mobile */}
      {aberto && (
        <div className={`border-t md:hidden ${escuro ? "border-white/10 bg-brand-950" : "border-slate-200 bg-white"}`}>
          <div className="container flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setAberto(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive(l.href)
                    ? escuro
                      ? "bg-white/10 text-white"
                      : "bg-brand-50 text-brand-700"
                    : escuro
                    ? "text-white/80 hover:bg-white/10"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {logado ? (
              <button
                onClick={sair}
                className={`mt-1 rounded-lg border px-3 py-2.5 text-left text-sm font-medium ${
                  escuro ? "border-white/20 text-white/80" : "border-slate-200 text-slate-600"
                }`}
              >
                Sair
              </button>
            ) : (
              <>
                <Link
                  href="/entrar"
                  onClick={() => setAberto(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    escuro ? "text-white/80 hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Entrar
                </Link>
                <Link
                  href="/#comprar"
                  onClick={() => setAberto(false)}
                  className={`rounded-lg px-3 py-2.5 text-center text-sm font-semibold ${
                    escuro ? "bg-meta text-brand-900" : "bg-brand-600 text-white"
                  }`}
                >
                  Quero meu acesso
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
