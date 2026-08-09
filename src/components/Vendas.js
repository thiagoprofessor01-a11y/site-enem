import Link from "next/link";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import FotoAprovado from "@/components/FotoAprovado";
import ComprarAcesso from "@/modules/pagamento/ComprarAcesso";
import { OFERTA, PLANOS, DEPOIMENTOS } from "@/lib/config";

// Landing page de vendas do Meu ENEM — tema ESCURO, animado e interativo.
// Identidade: Azul ENEM #3028D0 · Azul profundo #17106F · Ciano · Lilás · Verde · Amarelo.

const PARA_VOCE = [
  { icon: "alvo", titulo: "Passar no ENEM 2026" },
  { icon: "coracao", titulo: "Passar em Medicina pelo ENEM" },
  { icon: "capelo", titulo: "Entrar por SISU, ProUni e Fies" },
  { icon: "livro", titulo: "Reforçar o Ensino Médio" },
  { icon: "raio", titulo: "Treinar como treineiro" },
  { icon: "calendario", titulo: "Organizar os estudos sem se perder" },
];

const FEATURES = [
  { icon: "calendario", titulo: "Cronograma inteligente", desc: "Um plano dia a dia calculado pelo tempo que falta até a prova, priorizando o que mais cai." },
  { icon: "play", titulo: "Videoaulas selecionadas", desc: "As melhores aulas de cada assunto, escolhidas a dedo — sem perder tempo procurando." },
  { icon: "lista", titulo: "Banco de questões", desc: "Questões do ENEM por matéria e tópico, com correção na hora e tela cheia." },
  { icon: "raio", titulo: "Simulados", desc: "Simulados no estilo da prova para você treinar ritmo e controle de tempo." },
  { icon: "lapis", titulo: "Redação nota 1000", desc: "Os melhores temas e materiais para treinar as 5 competências avaliadas." },
  { icon: "livro", titulo: "Resumos", desc: "Resumos objetivos em PDF e imagem, por matéria, para revisar rápido." },
];

const INCLUSO = [
  "Conteúdo das 5 áreas: Matemática, Linguagens, Humanas, Natureza e Redação",
  "Cronograma / planejador de estudos personalizado",
  "Videoaulas selecionadas, do básico ao avançado",
  "Banco de questões do ENEM com filtros por matéria, tópico, ano e dificuldade",
  "Simulados cronometrados no estilo da prova, com desempenho",
  "Redação: banco de temas e correção pelas 5 competências",
  "Resumos objetivos em PDF e imagem para revisar rápido",
  "Acompanhamento da meta semanal e do seu progresso",
  "Acesso no celular, tablet ou computador",
];

const COMO = [
  { n: "1", titulo: "Escolha seu plano", desc: "Assine no mensal ou no trimestral e entre na plataforma na hora." },
  { n: "2", titulo: "Monte seu cronograma", desc: "Diga quantas horas por dia você tem e receba um plano sob medida." },
  { n: "3", titulo: "Estude com direção", desc: "Cada dia mostra o que estudar: aula, questões, simulado ou redação." },
];

const NUMEROS = [
  { v: "5", r: "áreas do conhecimento cobertas" },
  { v: "1", r: "plano de estudos só seu" },
  { v: "R$ 24,90", r: "por mês para começar" },
];

const FAQ = [
  { q: "Como funciona a cobrança?", a: "Você escolhe entre o plano mensal (R$ 24,90) ou o trimestral (R$ 57,90). A assinatura renova automaticamente no fim de cada período e você pode cancelar quando quiser." },
  { q: "Posso cancelar quando quiser?", a: "Sim. Você cancela a qualquer momento e continua com acesso até o fim do período já pago — sem multa e sem burocracia." },
  { q: "Qual a diferença entre mensal e trimestral?", a: "O conteúdo é o mesmo nos dois. No trimestral você paga a cada 3 meses e sai mais barato por mês — ideal para a reta final até a prova." },
  { q: "Funciona no celular?", a: "Funciona. A plataforma abre no navegador do celular, tablet ou computador." },
  { q: "Serve para qualquer curso?", a: "Sim. O conteúdo cobre todas as áreas do ENEM, então serve para qualquer curso e universidade que usam a nota." },
];

function Estrelas() {
  return (
    <div className="flex gap-0.5 text-meta">
      {"★★★★★".split("").map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </div>
  );
}

// Mockup de um computador com o site MeuENEM aberto na tela.
function ComputadorMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* brilho atrás */}
      <div className="pointer-events-none absolute -inset-8 animate-glow rounded-[3rem] bg-gradient-to-tr from-brand-500/50 via-ciano/30 to-transparent blur-3xl" />

      <div className="relative animate-float">
        {/* monitor */}
        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-2.5 shadow-2xl ring-1 ring-white/5 backdrop-blur">
          {/* barra do navegador */}
          <div className="flex items-center gap-2 px-2 pb-2.5 pt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            <span className="ml-2 flex-1 truncate rounded-md bg-white/10 px-3 py-1 text-center text-[11px] font-medium text-white/60">
              meuenem.online
            </span>
          </div>

          {/* tela / conteúdo do app */}
          <div className="rounded-xl bg-white p-5 text-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
                Meu ENEM
              </span>
              <span className="rounded-full bg-acerto/15 px-2.5 py-1 text-xs font-bold text-acerto">
                Plano de hoje
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Meta semanal</span>
                <span className="text-brand-600">74%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-brand-600 to-ciano" />
              </div>
            </div>
            <ul className="mt-5 space-y-2.5">
              {[
                ["Redação — revisar repertório", "lapis"],
                ["Matemática — 20 questões", "lista"],
                ["Natureza — simulado curto", "raio"],
              ].map(([txt, ic]) => (
                <li key={txt} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
                    <Icon name={ic} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{txt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* base / pé do monitor */}
        <div className="mx-auto h-5 w-24 rounded-b-xl bg-gradient-to-b from-slate-700 to-slate-800" />
        <div className="mx-auto h-2 w-44 rounded-full bg-slate-800/80 shadow-lg" />
      </div>
    </div>
  );
}

export default function Vendas() {
  return (
    <div className="overflow-hidden bg-brand-950 text-white">
      {/* ============================= HERO ============================= */}
      <section className="relative">
        {/* fundo com brilhos e grade */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_70%_-10%,rgba(48,40,208,0.45),transparent),radial-gradient(50rem_30rem_at_0%_20%,rgba(0,200,255,0.18),transparent)]" />
        <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 animate-glow rounded-full bg-ciano/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 animate-glow rounded-full bg-brand-500/40 blur-3xl" />

        <div className="container relative grid items-center gap-14 py-20 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-lilas ring-1 ring-white/15">
              🔥 Preparação completa para o ENEM
            </span>
            <h1 className="animate-fade-up mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Não é sobre estudar mais.{" "}
              <span className="animate-gradient-x bg-[length:200%_auto] bg-gradient-to-r from-ciano via-lilas to-ciano bg-clip-text text-transparent">
                É sobre estudar certo.
              </span>
            </h1>
            <p className="animate-fade-up mt-5 max-w-lg text-lg text-white/75">
              {OFERTA.subpromessa}
            </p>

            {/* Selo de preço em destaque */}
            <div className="animate-fade-up mt-8 inline-flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-lilas">A partir de</p>
                <p className="flex items-end gap-1 leading-none">
                  <span className="mb-0.5 text-lg font-bold">R$</span>
                  <span className="text-4xl font-extrabold">{PLANOS[0].preco.split(",")[0]}</span>
                  <span className="mb-0.5 text-lg font-bold">,{PLANOS[0].preco.split(",")[1]}</span>
                  <span className="mb-1 ml-1 text-sm font-semibold text-white/60">/mês</span>
                </p>
              </div>
              <span className="h-10 w-px bg-white/15" />
              <p className="max-w-[9rem] text-xs font-medium text-white/60">
                Cancele quando quiser · sem fidelidade
              </p>
            </div>

            <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#comprar"
                className="group relative overflow-hidden rounded-xl bg-meta px-7 py-4 text-center text-base font-extrabold text-brand-900 shadow-[0_0_30px_-5px_rgba(255,200,87,0.6)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                Quero começar agora
              </Link>
              <Link
                href="#recursos"
                className="rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-center text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Ver o que está incluso
              </Link>
            </div>

            <div className="animate-fade-up mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {DEPOIMENTOS.map((d) => (
                  <span
                    key={d.nome}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-950 bg-lilas text-sm font-bold text-brand-800"
                  >
                    {d.inicial}
                  </span>
                ))}
              </div>
              <div>
                <Estrelas />
                <p className="text-xs text-white/60">Aprovados que estudaram com direção</p>
              </div>
            </div>
          </div>

          {/* Mockup do computador */}
          <div className="animate-fade-up">
            <ComputadorMockup />
          </div>
        </div>
      </section>

      {/* ===================== IDEAL PARA VOCÊ QUE QUER ================ */}
      <section className="relative border-t border-white/5 py-20">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-ciano">
              Feito para o seu objetivo
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              A plataforma é ideal para você que quer
            </h2>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {PARA_VOCE.map((item, i) => (
              <Reveal
                key={item.titulo}
                delay={i * 70}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-ciano/40 hover:bg-white/10"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition group-hover:scale-110 group-hover:bg-ciano group-hover:text-brand-900">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <span className="text-base font-bold text-white">{item.titulo}</span>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex justify-center" delay={120}>
            <Link
              href="#comprar"
              className="rounded-xl bg-acerto px-8 py-4 text-base font-extrabold text-white shadow-[0_0_30px_-8px_rgba(33,181,115,0.7)] transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Assine agora
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============================ NÚMEROS ========================== */}
      <section className="border-y border-white/5 bg-white/[0.03]">
        <div className="container grid grid-cols-1 gap-6 py-10 sm:grid-cols-3">
          {NUMEROS.map((n, i) => (
            <Reveal key={n.r} delay={i * 90} className="text-center">
              <p className="bg-gradient-to-r from-ciano to-lilas bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                {n.v}
              </p>
              <p className="mt-1 text-sm text-white/60">{n.r}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================== RECURSOS ========================= */}
      <section id="recursos" className="scroll-mt-20 py-20">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-ciano">
              Tudo em um só lugar
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Uma plataforma completa para a sua aprovação
            </h2>
            <p className="mt-4 text-white/70">
              Você não precisa juntar mil materiais soltos. Aqui está tudo que você precisa,
              organizado e focado no que cai na prova.
            </p>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal
                key={f.titulo}
                delay={(i % 3) * 90}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-ciano/40 hover:bg-white/[0.08] hover:shadow-[0_20px_40px_-20px_rgba(0,200,255,0.4)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/30 text-ciano ring-1 ring-inset ring-ciano/30 transition group-hover:bg-ciano group-hover:text-brand-900">
                  <Icon name={f.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{f.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== CRONOGRAMA (destaque) ================= */}
      <section className="relative overflow-hidden border-y border-white/5 bg-gradient-to-br from-brand-900 to-brand-950 py-20">
        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 animate-glow rounded-full bg-ciano/15 blur-3xl" />
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-widest text-ciano">
              O diferencial
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Um plano de estudos que se adapta a você
            </h2>
            <p className="mt-4 text-white/70">
              Diga quantas horas por dia você tem até a prova. O Meu ENEM monta um cronograma
              inteligente, prioriza o que mais cai e mostra, todo dia, exatamente o que estudar.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Distribui as matérias pelas 5 áreas do conhecimento",
                "Prioriza os assuntos com maior incidência no ENEM",
                "Mostra as aulas e as questões do seu dia",
                "Você acompanha o progresso e nunca se perde",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-acerto text-xs font-black text-white">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-white/80">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            {[
              ["Segunda", "Matemática — Função afim"],
              ["Terça", "Biologia — Ecologia"],
              ["Quarta", "Redação — Estrutura da dissertação"],
            ].map(([dia, tarefa]) => (
              <div key={dia} className="flex items-center gap-4 border-b border-white/10 py-3 last:border-0">
                <span className="w-16 shrink-0 text-xs font-bold uppercase tracking-wide text-white/40">
                  {dia}
                </span>
                <span className="text-sm font-semibold text-white/90">{tarefa}</span>
              </div>
            ))}
            <div className="mt-4 flex gap-2">
              <span className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white">Aula</span>
              <span className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-bold text-white/70">Questões</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================= COMO FUNCIONA ====================== */}
      <section className="py-20">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Comece em 3 passos
            </h2>
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
            {COMO.map((p, i) => (
              <Reveal key={p.n} delay={i * 110} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-ciano text-xl font-extrabold text-white shadow-[0_0_25px_-6px_rgba(0,200,255,0.7)]">
                  {p.n}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{p.titulo}</h3>
                <p className="mt-2 text-sm text-white/65">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= ALUNOS APROVADOS ===================== */}
      <section id="depoimentos" className="scroll-mt-20 border-y border-white/5 bg-white/[0.03] py-20">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-ciano">
              Resultados de verdade
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Quem estudou com direção, passou
            </h2>
            <p className="mt-4 text-white/70">
              Alunos que se organizaram com o método e conquistaram a aprovação.
            </p>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {DEPOIMENTOS.map((d, i) => (
              <Reveal
                key={d.nome}
                delay={i * 110}
                as="figure"
                className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white text-slate-900 shadow-2xl"
              >
                <div className="relative flex aspect-[5/7] items-center justify-center overflow-hidden bg-gradient-to-br from-lilas to-brand-100">
                  <FotoAprovado foto={d.foto} nome={d.nome} resultado={d.resultado} />
                  <span className="absolute left-3 top-3 rounded-full bg-acerto px-2.5 py-1 text-xs font-bold text-white shadow">
                    Aprovado(a)
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Estrelas />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                    “{d.texto}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-slate-100 pt-4">
                    <span className="block text-sm font-extrabold text-slate-900">{d.nome}</span>
                    <span className="block text-xs font-medium text-brand-600">{d.resultado}</span>
                  </figcaption>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ PLANOS ========================== */}
      <section id="comprar" className="scroll-mt-20 py-20">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-ciano">
              Sua aprovação começa aqui
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Escolha seu plano de acesso
            </h2>
            <p className="mt-4 text-white/70">
              Os dois planos dão acesso a <strong className="text-white">tudo</strong>. Escolha a
              periodicidade que cabe no seu bolso — e cancele quando quiser.
            </p>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-4xl items-start gap-6 sm:grid-cols-2">
            {PLANOS.map((p, i) => (
              <Reveal
                key={p.id}
                delay={i * 120}
                className={`relative flex flex-col overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl transition hover:-translate-y-1 ${
                  p.destaque ? "ring-4 ring-meta" : "ring-1 ring-white/10"
                }`}
              >
                {p.destaque && (
                  <div className="bg-meta py-2 text-center text-xs font-extrabold uppercase tracking-widest text-brand-900">
                    ⭐ {p.selo}
                  </div>
                )}
                <div className="px-8 pb-6 pt-8 text-center">
                  <h3 className="text-lg font-extrabold uppercase tracking-wide text-brand-600">
                    Plano {p.nome}
                  </h3>
                  <div className="mt-4 flex items-end justify-center gap-1">
                    <span className="mb-2 text-2xl font-bold text-brand-600">R$</span>
                    <span className="text-6xl font-extrabold leading-none text-brand-600">{p.preco.split(",")[0]}</span>
                    <span className="mb-2 text-2xl font-bold text-brand-600">,{p.preco.split(",")[1]}</span>
                    <span className="mb-2 ml-1 text-sm font-semibold text-slate-500">{p.periodo}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-500">{p.renovacao}</p>
                </div>
                <div className="flex flex-1 flex-col border-t border-slate-100 px-8 py-8">
                  <p className="text-sm font-semibold text-slate-700">{p.resumo}</p>
                  <ul className="mt-5 space-y-3">
                    {INCLUSO.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-acerto text-xs font-black text-white">
                          ✓
                        </span>
                        <span className="font-medium text-slate-700">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <ComprarAcesso
                    plano={p.id}
                    className={`mt-8 flex w-full items-center justify-center rounded-xl px-6 py-4 text-base font-extrabold shadow-lg transition hover:-translate-y-0.5 hover:brightness-105 ${
                      p.destaque ? "bg-meta text-brand-900" : "bg-brand-600 text-white"
                    }`}
                  >
                    Quero este plano
                  </ComprarAcesso>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-xs font-medium text-white/50">
            Pagamento 100% seguro · acesso liberado na hora · cancele quando quiser
          </p>
        </div>
      </section>

      {/* ============================== FAQ =========================== */}
      <section className="border-t border-white/5 bg-white/[0.03] py-20">
        <div className="container mx-auto max-w-2xl">
          <Reveal>
            <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
              Perguntas frequentes
            </h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <details className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-white">
                    {item.q}
                    <span className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ciano font-black text-brand-900 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== CTA FINAL ========================= */}
      <section className="py-20">
        <div className="container">
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-800 to-brand-950 px-8 py-16 text-center shadow-2xl sm:px-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 animate-glow rounded-full bg-ciano/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 animate-glow rounded-full bg-brand-500/40 blur-3xl" />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              {OFERTA.promessa}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/75">
              Comece hoje com um plano claro e estude com foco até o dia da prova. Planos a partir
              de R$ {PLANOS[0].preco} por mês, cancele quando quiser.
            </p>
            <div className="relative mt-8 flex justify-center">
              <Link
                href="#comprar"
                className="rounded-xl bg-meta px-8 py-4 text-base font-extrabold text-brand-900 shadow-[0_0_35px_-5px_rgba(255,200,87,0.7)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                Ver planos — a partir de R$ {PLANOS[0].preco}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
