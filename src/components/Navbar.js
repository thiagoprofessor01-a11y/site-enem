"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSessao, logout } from "@/modules/auth/auth";
import Logo from "@/components/Logo";

// Ordem pedida (da direita p/ esquerda): Cronograma, Conteúdos, Questões,
// Simulados, Resumos, Redação → então da esquerda p/ direita fica ao contrário.
const LINKS_ALUNO = [
  { href: "/redacao", label: "Redação" },
  { href: "/resumos", label: "Resumos" },
  { href: "/simulados", label: "Simulados" },
  { href: "/questoes", label: "Questões" },
  { href: "/conteudos", label: "Conteúdos" },
  { href: "/cronograma", label: "Cronograma" },
];

function PerfilBtn({ onClick }) {
  return (
    <Link
      href="/perfil"
      onClick={onClick}
      aria-label="Meu perfil"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition hover:bg-brand-100"
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

  async function sair() {
    setAberto(false);
    await logout();
    router.replace("/");
  }

  // Links do menu (sem "Meu perfil" — ele virou o ícone no canto).
  const links = logado ? (isAdmin ? [{ href: "/admin", label: "Admin" }] : LINKS_ALUNO) : [];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="container flex h-16 items-center gap-4">
        <Link href="/" onClick={() => setAberto(false)} className="flex shrink-0 items-center">
          <Logo className="h-8 w-auto" />
        </Link>

        {/* Desktop — links centralizados */}
        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(l.href)
                  ? "bg-brand-50 text-brand-700"
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
              <PerfilBtn />
              <button
                onClick={sair}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/entrar" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
                Entrar
              </Link>
              <Link href="/#comprar" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">
                Quero meu acesso
              </Link>
            </>
          )}
        </div>

        {/* Mobile: perfil + ação + hambúrguer */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          {logado && <PerfilBtn onClick={() => setAberto(false)} />}
          {!logado && (
            <Link href="/#comprar" className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm">
              Quero acesso
            </Link>
          )}
          <button
            onClick={() => setAberto((v) => !v)}
            aria-label="Menu"
            aria-expanded={aberto}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
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
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setAberto(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive(l.href) ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {logado ? (
              <button
                onClick={sair}
                className="mt-1 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-600"
              >
                Sair
              </button>
            ) : (
              <>
                <Link
                  href="/entrar"
                  onClick={() => setAberto(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Entrar
                </Link>
                <Link
                  href="/#comprar"
                  onClick={() => setAberto(false)}
                  className="rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
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
