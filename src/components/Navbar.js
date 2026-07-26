"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SITE } from "@/lib/config";
import { useSessao, logout } from "@/modules/auth/auth";

// Links da área do aluno (aparecem só quando logado como aluno/admin).
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

  const logado = Boolean(sessao && sessao.role);
  const isAdmin = logado && sessao.role === "admin";

  const isActive = (href) => pathname.startsWith(href);

  function sair() {
    logout();
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            M
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            {SITE.nome}
          </span>
        </Link>

        {/* Links centrais — só para alunos logados */}
        {logado && !isAdmin && (
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS_ALUNO.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(link.href)
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Lado direito — depende do estado de login */}
        <div className="flex items-center gap-2">
          {!logado && (
            <>
              <Link
                href="/entrar"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:block"
              >
                Entrar
              </Link>
              <Link
                href="/#comprar"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Quero meu acesso
              </Link>
            </>
          )}

          {logado && (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive("/admin")
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Admin
                </Link>
              )}
              {!isAdmin && (
                <Link
                  href="/perfil"
                  className={`hidden text-sm font-medium transition sm:block ${
                    isActive("/perfil")
                      ? "text-brand-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {sessao.nome}
                </Link>
              )}
              {isAdmin && (
                <span className="hidden text-sm text-slate-500 sm:block">
                  {sessao.nome}
                </span>
              )}
              <button
                onClick={sair}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
