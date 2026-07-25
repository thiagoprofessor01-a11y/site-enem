import Link from "next/link";
import Countdown from "@/components/Countdown";
import {
  SITE,
  DEFAULT_ENEM_DATE,
  OFERTA,
  BENEFICIOS,
  DEPOIMENTOS,
} from "@/lib/config";

// PÁGINA DE VENDAS (pública) — Time D / marketing.
// Único conteúdo aberto: convence a pessoa a comprar o acesso.
// O botão de compra leva a /cadastro por enquanto; quando o pagamento
// (Mercado Pago) estiver ligado, passa a iniciar o checkout.

const COMO_FUNCIONA = [
  {
    n: "1",
    titulo: "Crie sua conta",
    desc: "Você garante seu acesso e entra na plataforma em minutos.",
  },
  {
    n: "2",
    titulo: "Monte seu cronograma",
    desc: "Diz quantas horas tem por dia e recebe um plano de estudos sob medida.",
  },
  {
    n: "3",
    titulo: "Estude o que mais cai",
    desc: "Videoaulas, questões, simulados e redação — tudo em um só lugar.",
  },
];

const FAQ = [
  {
    q: "O pagamento é único mesmo?",
    a: "Sim. Você paga uma vez e tem acesso vitalício — sem mensalidade e sem cobranças surpresa.",
  },
  {
    q: "Funciona no celular?",
    a: "Funciona. A plataforma abre no navegador do celular, tablet ou computador.",
  },
  {
    q: "Serve para qualquer curso?",
    a: "Sim. O conteúdo cobre todas as áreas do ENEM, então serve para qualquer curso e universidade que usam a nota.",
  },
  {
    q: "Por quanto tempo tenho acesso?",
    a: "Para sempre. Uma vez comprado, o acesso é seu — estude no seu ritmo, sem prazo para acabar.",
  },
];

export default function VendasPage() {
  return (
    <div>
      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-transparent" />
        <div className="container flex flex-col items-center py-20 text-center sm:py-24">
          <span className="animate-fade-up rounded-full border border-brand-100 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
            🎯 Preparação completa para o ENEM
          </span>

          <h1 className="animate-fade-up mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            {OFERTA.promessa.split("ENEM")[0]}
            <span className="text-brand-600">ENEM</span>
            {OFERTA.promessa.split("ENEM")[1]}
          </h1>

          <p className="animate-fade-up mt-6 max-w-2xl text-lg text-slate-600">
            {OFERTA.subpromessa}
          </p>

          <div className="animate-fade-up mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="#comprar" className="btn-primary text-base">
              Quero meu acesso — R$ {OFERTA.preco}
            </Link>
            <Link href="#beneficios" className="btn-secondary text-base">
              Ver o que está incluso
            </Link>
          </div>
          <p className="animate-fade-up mt-4 text-sm text-slate-500">
            {OFERTA.parcelaOuAvista} · {OFERTA.acesso}
          </p>

          <div className="animate-fade-up mt-12 w-full">
            <Countdown dataEnem={DEFAULT_ENEM_DATE} />
          </div>
        </div>
      </section>

      {/* ========================== BENEFÍCIOS ========================= */}
      <section id="beneficios" className="container scroll-mt-20 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Tudo que você recebe no acesso
          </h2>
          <p className="mt-3 text-slate-600">
            Cinco ferramentas que trabalham juntas para organizar seus estudos e
            focar no que realmente cai na prova.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className="card flex flex-col p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                {b.emoji}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {b.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= COMO FUNCIONA ======================= */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Como funciona
            </h2>
            <p className="mt-3 text-slate-600">
              Do cadastro ao estudo focado em três passos simples.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
            {COMO_FUNCIONA.map((p) => (
              <div key={p.n} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                  {p.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {p.titulo}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= DEPOIMENTOS ========================= */}
      <section id="depoimentos" className="container scroll-mt-20 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Quem usou, passou
          </h2>
          <p className="mt-3 text-slate-600">
            Alunos que se organizaram com o método e conquistaram a federal.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {DEPOIMENTOS.map((d) => (
            <figure key={d.nome} className="card flex flex-col p-6">
              <div className="mb-4 flex gap-0.5 text-amber-400">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-slate-700">
                “{d.texto}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                  {d.inicial}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {d.nome}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {d.resultado}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============================ OFERTA =========================== */}
      <section id="comprar" className="container scroll-mt-20 py-16">
        <div className="mx-auto max-w-lg">
          <div className="card overflow-hidden border-brand-200 shadow-card-hover">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-8 text-center text-white">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-100">
                Acesso completo
              </p>
              <div className="mt-3 flex items-baseline justify-center gap-1">
                <span className="text-2xl font-semibold">R$</span>
                <span className="text-6xl font-extrabold">{OFERTA.preco}</span>
              </div>
              <p className="mt-2 text-sm text-brand-100">
                {OFERTA.parcelaOuAvista} · {OFERTA.acesso}
              </p>
            </div>
            <div className="px-8 py-8">
              <ul className="space-y-3">
                {BENEFICIOS.map((b) => (
                  <li key={b.titulo} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 text-green-600">✓</span>
                    <span className="text-slate-700">
                      <strong className="font-semibold text-slate-900">
                        {b.titulo}
                      </strong>{" "}
                      — {b.desc}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/cadastro"
                className="btn-primary mt-8 w-full text-base"
              >
                Garantir meu acesso agora
              </Link>
              <p className="mt-3 text-center text-xs text-slate-500">
                Pagamento 100% seguro · acesso liberado na hora
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== FAQ =========================== */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Perguntas frequentes
          </h2>
          <div className="mt-10 space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="card group p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                  {item.q}
                  <span className="text-brand-600 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== CTA FINAL ========================= */}
      <section className="container pb-8 pt-4">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
            {OFERTA.promessa}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Garanta seu acesso completo por R$ {OFERTA.preco} — pagamento único,
            para sempre.
          </p>
          <Link
            href="#comprar"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
          >
            Quero meu acesso
          </Link>
        </div>
      </section>
    </div>
  );
}
