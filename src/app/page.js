import Link from "next/link";
import { SITE } from "@/lib/config";

// HOME / DASHBOARD — Time D
// Contagem regressiva, tarefa do dia, progresso e atalhos.
// Os blocos abaixo são placeholders para o Time D preencher com dados reais.

const ATALHOS = [
  { href: "/questoes", titulo: "Fazer questões", emoji: "📝" },
  { href: "/redacao", titulo: "Praticar redação", emoji: "✍️" },
  { href: "/conteudos", titulo: "Ver conteúdo", emoji: "📚" },
  { href: "/cronograma", titulo: "Meu cronograma", emoji: "🗓️" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white">
        <h1 className="text-3xl font-bold">{SITE.nome}</h1>
        <p className="mt-2 text-brand-100">{SITE.descricao}</p>
        <div className="mt-6 flex flex-wrap gap-6">
          <div>
            <p className="text-4xl font-bold">—</p>
            <p className="text-sm text-brand-100">dias até o ENEM</p>
          </div>
          <div>
            <p className="text-4xl font-bold">—%</p>
            <p className="text-sm text-brand-100">cronograma cumprido</p>
          </div>
          <div>
            <p className="text-4xl font-bold">—</p>
            <p className="text-sm text-brand-100">dias de sequência</p>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Tarefa do dia</h2>
          <p className="mt-2 text-sm text-slate-500">
            (Time D) Puxar do módulo de cronograma do Time A o item de hoje.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Atalhos</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {ATALHOS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
              >
                <span className="text-xl">{a.emoji}</span>
                {a.titulo}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
