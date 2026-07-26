"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SITE } from "@/lib/config";
import { useSessao, logout } from "@/modules/auth/auth";

const LINKS_ALUNO = [
  { href: "/conteudos", label: "Conteúdos" },
  { href: "/cronograma", label: "Cronograma" },
  { href: "/questoes", label: "Questões" },
  { href: "/redacao", label: "Redação" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const sessao = useSessao();
  const [aberto, setAberto] = useState(false);

  const logado = Boolean(sessao && sessao.role);
  const isAdmin = logado && sessao.role === "admin";
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  function sair() {
    setAberto(false);
    logout();
    router.replace("/");
  }

  // Links que aparecem no menu (desktop e mobile).
  const links = logado
    ? isAdmin
      ? [{ href: "/admin", label: "Admin" }]
      : [...LINKS_ALUNO, { href: "/perfil", label: "Meu perfil" }]
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" onClick={() => setAberto(false)} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            M
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">{SITE.nome}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
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
          {logado ? (
            <button
              onClick={sair}
              className="ml-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Sair
            </button>
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

        {/* Mobile: ação principal + hambúrguer */}
        <div className="flex items-center gap-2 md:hidden">
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
