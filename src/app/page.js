import Link from "next/link";
import Countdown from "@/components/Countdown";
import { SITE, DEFAULT_ENEM_DATE, PILARES } from "@/lib/config";

// HOME / DASHBOARD — Time D
// Quando houver login, troque DEFAULT_ENEM_DATE pela data do usuário e
// preencha os números reais de progresso (via módulo do Time A / Time B).

export default function HomePage() {
  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-transparent" />
        <div className="container flex flex-col items-center py-20 text-center sm:py-24">
          <span className="animate-fade-up rounded-full border border-brand-100 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
            🎯 Sua aprovação começa por aqui
          </span>

          <h1 className="animate-fade-up mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Estude para o ENEM com{" "}
            <span className="text-brand-600">foco no que mais cai</span>
          </h1>

          <p className="animate-fade-up mt-6 max-w-2xl text-lg text-slate-600">
            {SITE.nome} reúne cronograma inteligente, banco de questões, redação
            e videoaulas em um só lugar — para você estudar o essencial e chegar
            confiante no dia da prova.
          </p>

          <div className="animate-fade-up mt-10 w-full">
            <Countdown dataEnem={DEFAULT_ENEM_DATE} />
          </div>

          <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/cadastro" className="btn-primary">
              Criar meu plano de estudos
            </Link>
            <Link href="/conteudos" className="btn-secondary">
              Explorar conteúdos
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* PILARES                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Tudo que você precisa para a prova
          </h2>
          <p className="mt-3 text-slate-600">
            Quatro ferramentas que trabalham juntas para organizar seus estudos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-card-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                {p.emoji}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {p.titulo}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {p.descricao}
              </p>
              <span className="mt-4 text-sm font-semibold text-brand-600 transition group-hover:gap-2">
                Acessar →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA FINAL                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="container pb-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
            Pronto para transformar sua rotina de estudos?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Crie sua conta gratuitamente e monte um cronograma sob medida em
            poucos minutos.
          </p>
          <Link
            href="/cadastro"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
          >
            Começar agora — é grátis
          </Link>
        </div>
      </section>
    </div>
  );
}
