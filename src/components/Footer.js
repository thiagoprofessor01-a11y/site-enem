import Link from "next/link";
import { SITE } from "@/lib/config";
import Logo from "@/components/Logo";

const COLUNAS = [
  {
    titulo: "Estudar",
    links: [
      { href: "/conteudos", label: "Conteúdos" },
      { href: "/cronograma", label: "Cronograma" },
      { href: "/simulados", label: "Simulados" },
      { href: "/redacao", label: "Redação" },
      { href: "/resumos", label: "Resumos" },
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
  {
    titulo: "Legal",
    links: [
      { href: "/privacidade", label: "Privacidade" },
      { href: "/termos", label: "Termos de uso" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-950 text-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo className="h-9 w-auto brightness-0 invert" />
            <p className="mt-3 max-w-xs text-sm text-white/60">
              {SITE.descricao}
            </p>
          </div>
          {COLUNAS.map((col) => (
            <div key={col.titulo}>
              <h3 className="text-sm font-semibold text-white">
                {col.titulo}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/60 transition hover:text-ciano"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {SITE.nome}. Feito para quem vai passar no ENEM.
        </div>
      </div>
    </footer>
  );
}
