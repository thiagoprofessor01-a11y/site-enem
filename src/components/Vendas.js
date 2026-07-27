import Link from "next/link";
import Icon from "@/components/Icon";
import { OFERTA, BENEFICIOS, DEPOIMENTOS } from "@/lib/config";

// PÁGINA DE VENDAS (pública) — estilo "cartaz": tipografia pesada, cores
// vibrantes, cards arredondados e chips coloridos. O botão de compra leva a
// /cadastro por enquanto; quando o Mercado Pago estiver ligado, inicia o checkout.

// Cada benefício ganha um ícone, uma etiqueta e uma cor.
const FEATURES = [
  { i: 0, icon: "calendario", tag: "PLANO", cor: "bg-grape", chip: "text-grape" },
  { i: 1, icon: "lista", tag: "QUESTÕES", cor: "bg-teal", chip: "text-teal" },
  { i: 2, icon: "raio", tag: "TREINO", cor: "bg-pink", chip: "text-pink" },
  { i: 3, icon: "lapis", tag: "REDAÇÃO", cor: "bg-coral", chip: "text-coral" },
  { i: 4, icon: "play", tag: "AULAS", cor: "bg-brand-600", chip: "text-brand-600" },
];

const PORQUE = [
  { icon: "raio", titulo: "100% online", cor: "bg-grape", desc: "Estude do celular, tablet ou computador, na hora que quiser." },
  { icon: "calendario", titulo: "Cronograma sob medida", cor: "bg-teal", desc: "Um plano dia a dia montado pelo tempo que você tem até a prova." },
  { icon: "calculo", titulo: "Foco no que mais cai", cor: "bg-pink", desc: "Priorizamos os assuntos com maior incidência no ENEM." },
  { icon: "livro", titulo: "Do básico ao avançado", cor: "bg-coral", desc: "Conteúdo completo das 5 áreas, sem enrolação." },
];

const COMO = [
  { n: "1", titulo: "Garanta seu acesso", desc: "Pagamento único e você entra na plataforma em minutos." },
  { n: "2", titulo: "Monte seu cronograma", desc: "Diga quantas horas tem por dia e receba um plano sob medida." },
  { n: "3", titulo: "Estude o que mais cai", desc: "Aulas, questões, simulados e redação — tudo em um só lugar." },
];

const FAQ = [
  { q: "O pagamento é único mesmo?", a: "Sim. Você paga uma vez e tem acesso vitalício — sem mensalidade e sem cobranças surpresa." },
  { q: "Funciona no celular?", a: "Funciona. A plataforma abre no navegador do celular, tablet ou computador." },
  { q: "Serve para qualquer curso?", a: "Sim. O conteúdo cobre todas as áreas do ENEM, então serve para qualquer curso e universidade que usam a nota." },
  { q: "Por quanto tempo tenho acesso?", a: "Para sempre. Uma vez comprado, o acesso é seu — estude no seu ritmo, sem prazo para acabar." },
];

const MARQUEE = [
  "CRONOGRAMA INTELIGENTE",
  "BANCO DE QUESTÕES",
  "SIMULADOS CRONOMETRADOS",
  "REDAÇÃO NOTA 1000",
  "VIDEOAULAS SELECIONADAS",
  "FOCO NO QUE MAIS CAI",
];

export default function Vendas() {
  return (
    <div className="bg-paper text-ink">
      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden bg-coral">
        {/* formas decorativas */}
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-sun/40 blur-2xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-grape/30 blur-2xl" />

        <div className="container relative flex flex-col items-center py-16 text-center sm:py-20">
          <span className="animate-fade-up rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white">
            Plataforma de estudos para o ENEM
          </span>

          <h1 className="animate-fade-up mt-6 font-display text-5xl uppercase leading-[0.92] tracking-tight text-ink sm:text-7xl md:text-8xl">
            Passe no{" "}
            <span className="relative inline-block">
              <span className="relative z-10">ENEM</span>
              <span className="absolute inset-x-[-6px] bottom-1 z-0 h-4 -rotate-1 bg-sun sm:h-6" />
            </span>{" "}
            ainda em 2026
          </h1>

          {/* caixa de destaque estilo etiqueta */}
          <div className="animate-fade-up mt-8 -rotate-1 rounded-2xl bg-ink px-6 py-4 shadow-lg">
            <p className="font-display text-xl uppercase text-white sm:text-2xl">
              Método completo · Pagamento único
            </p>
          </div>

          <p className="animate-fade-up mt-7 max-w-xl text-base font-medium text-ink/80 sm:text-lg">
            {OFERTA.subpromessa}
          </p>

          <Link
            href="#comprar"
            className="animate-fade-up mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-base font-extrabold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
          >
            QUERO MEU ACESSO →
          </Link>
        </div>

        {/* onda de transição */}
        <div className="h-8 bg-paper [clip-path:ellipse(75%_100%_at_50%_100%)]" />
      </section>

      {/* ============================ PREÇO =========================== */}
      <section id="comprar" className="container -mt-4 scroll-mt-24">
        <div className="relative mx-auto max-w-xl">
          {/* selo adesivo */}
          <div className="absolute -right-2 -top-6 z-20 rotate-6 rounded-2xl border-2 border-dashed border-white bg-ink px-4 py-3 text-center shadow-lg sm:-right-6">
            <p className="font-display text-2xl leading-none text-sun">ACESSO</p>
            <p className="font-display text-lg uppercase leading-none text-white">vitalício</p>
          </div>

          <div className="overflow-hidden rounded-[28px] border-4 border-ink bg-white shadow-[0_20px_50px_-20px_rgba(27,20,48,0.5)]">
            <div className="px-7 pt-8 sm:px-9">
              <span className="inline-flex rounded-full border-2 border-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide">
                Acesso completo
              </span>
              <div className="mt-5 flex items-end gap-1">
                <span className="mb-3 font-display text-3xl">R$</span>
                <span className="font-display text-7xl leading-none tracking-tight sm:text-8xl">
                  {OFERTA.preco.split(",")[0]}
                </span>
                <span className="mb-3 font-display text-3xl">,{OFERTA.preco.split(",")[1]}</span>
              </div>
              <p className="mt-1 text-sm font-bold text-ink/60">
                {OFERTA.parcelaOuAvista} · {OFERTA.acesso}
              </p>

              <Link
                href="/cadastro"
                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-coral px-6 py-4 text-lg font-extrabold uppercase text-ink shadow-md transition hover:-translate-y-0.5 hover:bg-[#ff543a]"
              >
                Garanta sua vaga
              </Link>
              <p className="mt-3 text-center text-xs font-semibold text-ink/50">
                Pagamento 100% seguro · acesso liberado na hora
              </p>
            </div>

            <ul className="mt-7 grid gap-px bg-ink/10 sm:grid-cols-2">
              {BENEFICIOS.map((b) => (
                <li key={b.titulo} className="flex items-start gap-2 bg-white px-6 py-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-xs font-black text-white">
                    ✓
                  </span>
                  <span className="text-sm font-bold text-ink">{b.titulo}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ========================= FEATURES =========================== */}
      <section id="beneficios" className="container scroll-mt-20 py-16">
        <h2 className="mx-auto max-w-2xl text-center font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl">
          Tudo que você recebe
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center font-medium text-ink/70">
          Cinco ferramentas que trabalham juntas para você focar no que realmente cai na prova.
        </p>

        <div className="mx-auto mt-12 max-w-2xl space-y-4">
          {FEATURES.map((f) => {
            const b = BENEFICIOS[f.i];
            return (
              <div
                key={b.titulo}
                className="flex items-start gap-4 rounded-3xl border-2 border-ink bg-white p-5 shadow-[0_6px_0_0_#1b1430] transition hover:-translate-y-0.5"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${f.cor} text-white`}>
                  <Icon name={f.icon} className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-extrabold text-ink">{b.titulo}</h3>
                    <span className={`rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white`}>
                      {f.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink/70">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================== MARQUEE =========================== */}
      <div className="overflow-hidden border-y-4 border-ink bg-grape py-3">
        <div className="flex w-max animate-marquee gap-6 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="flex items-center gap-6 font-display text-lg uppercase text-white">
              {t}
              <span className="text-sun">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ======================= POR QUE ESCOLHER ===================== */}
      <section className="container py-16">
        <h2 className="mx-auto max-w-2xl text-center font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl">
          Por que o MeuENEM?
        </h2>

        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          {PORQUE.map((p) => (
            <div key={p.titulo} className="rounded-3xl border-2 border-ink bg-white p-6 text-center shadow-[0_6px_0_0_#1b1430]">
              <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${p.cor} text-white`}>
                <Icon name={p.icon} className="h-7 w-7" />
              </span>
              <h3 className="mt-4 inline-block -rotate-1 rounded-lg bg-sun px-3 py-1 font-display text-lg uppercase text-ink">
                {p.titulo}
              </h3>
              <p className="mt-3 text-sm font-medium text-ink/70">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= DEPOIMENTOS ======================== */}
      <section id="depoimentos" className="bg-ink py-16 text-white">
        <div className="container">
          <h2 className="mx-auto max-w-2xl text-center font-display text-4xl uppercase leading-none tracking-tight text-white sm:text-5xl">
            Resultados de quem confiou
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center font-medium text-white/70">
            Alunos que se organizaram com o método e conquistaram a federal.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
            {DEPOIMENTOS.map((d, idx) => {
              const cores = ["bg-coral", "bg-teal", "bg-sun"];
              return (
                <figure key={d.nome} className="flex flex-col rounded-3xl bg-white p-6 text-ink">
                  <div className="mb-3 flex gap-0.5 text-sun">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i}>{s}</span>
                    ))}
                  </div>
                  <blockquote className="flex-1 text-sm font-medium leading-relaxed text-ink/80">
                    “{d.texto}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-full ${cores[idx % 3]} font-display text-lg text-white`}>
                      {d.inicial}
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold text-ink">{d.nome}</span>
                      <span className="block text-xs font-semibold text-ink/60">{d.resultado}</span>
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="#comprar"
              className="inline-flex items-center gap-2 rounded-full bg-sun px-8 py-4 text-base font-extrabold uppercase text-ink shadow-xl transition hover:-translate-y-0.5"
            >
              Junte-se aos aprovados →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================= COMO FUNCIONA ====================== */}
      <section className="container py-16">
        <h2 className="mx-auto max-w-2xl text-center font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl">
          Como funciona
        </h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {COMO.map((p, idx) => {
            const cores = ["bg-coral", "bg-teal", "bg-grape"];
            return (
              <div key={p.n} className="rounded-3xl border-2 border-ink bg-white p-6 text-center shadow-[0_6px_0_0_#1b1430]">
                <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${cores[idx]} font-display text-xl text-white`}>
                  {p.n}
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-ink">{p.titulo}</h3>
                <p className="mt-2 text-sm font-medium text-ink/70">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================== FAQ =========================== */}
      <section className="container mx-auto max-w-2xl py-16">
        <h2 className="text-center font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl">
          Perguntas frequentes
        </h2>
        <div className="mt-10 space-y-4">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border-2 border-ink bg-white p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between font-extrabold text-ink">
                {item.q}
                <span className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral font-black text-ink transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ink/70">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ========================== CTA FINAL ========================= */}
      <section className="container pb-16">
        <div className="relative overflow-hidden rounded-[32px] bg-coral px-8 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-sun/50 blur-2xl" />
          <h2 className="relative mx-auto max-w-2xl font-display text-4xl uppercase leading-none tracking-tight text-ink sm:text-5xl">
            {OFERTA.promessa}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl font-bold text-ink/80">
            Acesso completo por R$ {OFERTA.preco} — pagamento único, para sempre.
          </p>
          <Link
            href="/cadastro"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-base font-extrabold uppercase text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
          >
            Quero meu acesso →
          </Link>
        </div>
      </section>
    </div>
  );
}
