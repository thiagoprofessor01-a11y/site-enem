import Link from "next/link";
import { SITE } from "@/lib/config";

const COLUNAS = [
  {
    titulo: "Estudar",
    links: [
      { href: "/cronograma", label: "Cronograma" },
      { href: "/questoes", label: "Questões" },
      { href: "/redacao", label: "Redação" },
      { href: "/conteudos", label: "Conteúdos" },
    ],
  },
  {
    titulo: "Conta",
    links: [
      { href: "/cadastro", label: "Criar conta" },
      { href: "/perfil", label: "Meu perfil" },
      { href: "/admin", label: "Admin" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                M
              </span>
              <span className="text-lg font-bold text-slate-900">
                {SITE.nome}
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              {SITE.descricao}
            </p>
          </div>
          {COLUNAS.map((col) => (
            <div key={col.titulo}>
              <h3 className="text-sm font-semibold text-slate-900">
                {col.titulo}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 transition hover:text-brand-700"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {SITE.nome}. Feito para quem vai passar no ENEM.
        </div>
      </div>
    </footer>
  );
}
