import Link from "next/link";
import { SITE } from "@/lib/config";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/cronograma", label: "Cronograma" },
  { href: "/questoes", label: "Questões" },
  { href: "/redacao", label: "Redação" },
  { href: "/conteudos", label: "Conteúdos" },
  { href: "/perfil", label: "Perfil" },
];

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-brand-700">
          {SITE.nome}
        </Link>
        <ul className="flex flex-wrap gap-1 text-sm">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded px-3 py-1.5 text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
