import Link from "next/link";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import FotoAprovado from "@/components/FotoAprovado";
import TelaMockup from "@/components/TelaMockup";
import PlataformaMac from "@/components/PlataformaMac";
import ComprarAcesso from "@/modules/pagamento/ComprarAcesso";
import { OFERTA, PLANOS, DEPOIMENTOS } from "@/lib/config";

// Landing page de vendas do Meu ENEM — tema ESCURO, ousado e direto.
// Diferencial central: CRONOGRAMA DE ESTUDOS PERSONALIZADO.

const PARA_VOCE = [
  { icon: "alvo", titulo: "Passar no ENEM 2026" },
  { icon: "coracao", titulo: "Passar em Medicina pelo ENEM" },
  { icon: "capelo", titulo: "Entrar por SISU, ProUni e Fies" },
  { icon: "livro", titulo: "Reforçar o Ensino Médio" },
  { icon: "raio", titulo: "Treinar como treineiro" },
  { icon: "calendario", titulo: "Organizar os estudos sem se perder" },
];

const FEATURES = [
  { icon: "calendario", titulo: "Cronograma personalizado", desc: "Um plano dia a dia calculado pelo tempo que falta até a prova, priorizando o que mais cai. É o nosso diferencial." },
  { icon: "play", titulo: "Videoaulas selecionadas", desc: "As melhores aulas de cada assunto, escolhidas a dedo — sem perder tempo procurando." },
  { icon: "lista", titulo: "Banco de questões", desc: "Questões do ENEM por matéria e tópico, com gabarito na hora e tela cheia." },
  { icon: "raio", titulo: "Simulados", desc: "Simulados no estilo da prova para você treinar ritmo e controle de tempo." },
  { icon: "lapis", titulo: "Redação", desc: "Os melhores temas e materiais para treinar as 5 competências avaliadas." },
  { icon: "livro", titulo: "Resumos", desc: "Resumos objetivos em PDF e imagem, por matéria, para revisar rápido." },
];

// Itens do card de preço no hero (curtos, com check verde).
const CARD_DESTAQUES = [
  "Cronograma personalizado: diz o que estudar hoje",
  "Videoaulas focadas no que mais cai",
  "Banco de questões do ENEM com gabarito na hora",
  "Simulados no estilo da prova",
  "Redação: temas e materiais das 5 competências",
  "Resumos em PDF para revisar rápido",
];

// Frases da faixa que rola (marquee) abaixo do hero.
const TICKER = [
  "Cronograma de estudos personalizado",
  "Preparação completa para o ENEM 2026",
  "Foco no que mais cai",
  "Plano mensal ou trimestral",
  "Cancele quando quiser",
];

// Pontos fortes do cronograma (seção diferencial).
const CRONOGRAMA_PONTOS = [
  ["Feito sob medida", "Você diz seu tempo e sua data de prova; o plano se molda a você."],
  ["Prioriza o que mais cai", "As matérias entram na ordem certa — do que mais cai para o que menos cai."],
  ["Diz o que fazer hoje", "Todo dia mostra a aula, as questões e o simulado da vez. Sem se perder."],
  ["Acompanha seu progresso", "Você vê a meta semanal andar e nunca fica no escuro."],
];

const INCLUSO = [
  "Cronograma de estudos 100% personalizado — nosso diferencial",
  "Conteúdo das 5 áreas: Matemática, Linguagens, Humanas, Natureza e Redação",
  "Videoaulas selecionadas, do básico ao avançado",
  "Banco de questões do ENEM com filtros por matéria, tópico, ano e dificuldade",
  "Simulados cronometrados no estilo da prova, com desempenho",
  "Redação: banco de temas e materiais das 5 competências",
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
  { v: "1", r: "cronograma feito só para você" },
  { v: "R$ 24,90", r: "por mês para começar" },
];

const FAQ = [
  { q: "Como funciona o cronograma personalizado?", a: "Você informa quantas horas por dia tem e a sua data de prova. A plataforma monta um plano de estudos sob medida, prioriza o que mais cai e mostra, todo dia, exatamente o que estudar. É o que nos diferencia." },
  { q: "Como funciona a cobrança?", a: "Você escolhe entre o plano mensal (R$ 24,90) ou o trimestral (R$ 57,90). A assinatura renova automaticamente no fim de cada período e você pode cancelar quando quiser." },
  { q: "Posso cancelar quando quiser?", a: "Sim. Você cancela a qualquer momento e continua com acesso até o fim do período já pago — sem multa e sem burocracia." },
  { q: "Qual a diferença entre mensal e trimestral?", a: "O conteúdo é o mesmo nos dois. No trimestral você paga a cada 3 meses e sai mais barato por mês — ideal para a reta final até a prova." },
  { q: "Funciona no celular?", a: "Funciona. A plataforma abre no navegador do celular, tablet ou computador." },
  { q: "Serve para qualquer curso?", a: "Sim. O conteúdo cobre todas as áreas do ENEM, então serve para qualquer curso e universidade que usam a nota." },
];

// Mini agenda usada na seção do cronograma.
function AgendaMock() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      {[
        ["Segunda", "Matemática — Função afim"],
        ["Terça", "Biologia — Ecologia"],
        ["Quarta", "Redação — Estrutura da dissertação"],
      ].map(([dia, tarefa]) => (
        <div key={dia} className="flex items-center gap-4 border-b border-white/10 py-3 last:border-0">
          <span className="w-16 shrink-0 text-xs font-bold uppercase tracking-wide text-white/40">{dia}</span>
          <span className="text-sm font-semibold text-white/90">{tarefa}</span>
        </div>
      ))}
      <div className="mt-4 rounded-xl bg-acerto/15 p-3 text-center text-sm font-bold text-acerto">
        Seu plano de hoje, montado automaticamente
      </div>
    </div>
  );
}

// Mockup de um computador com o site MeuENEM aberto na tela.
function ComputadorMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-brand-600/20 blur-3xl" />
      <div className="relative">
        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-2.5 shadow-2xl ring-1 ring-white/5">
          <div className="flex items-center gap-2 px-2 pb-2.5 pt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            <span className="ml-2 flex-1 truncate rounded-md bg-white/10 px-3 py-1 text-center text-[11px] font-medium text-white/60">
              meuenem.online
            </span>
          </div>
          <div className="overflow-hidden rounded-xl bg-white">
            <TelaMockup />
          </div>
        </div>
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
      <section className="relative border-b border-white/10">
        <div className="container grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Esquerda — título forte */}
          <div className="animate-fade-up">
            <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-ciano">
              Plataforma de estudos para o ENEM
            </span>
            <h1 className="mt-4 text-5xl font-extrabold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              Preparação<br />completa
            </h1>
            <span className="mt-5 inline-block bg-acerto px-3 py-1.5 text-lg font-extrabold uppercase tracking-tight text-brand-950 sm:text-xl">
              Com cronograma personalizado
            </span>
            <p className="mt-6 max-w-md text-lg text-white/75">
              Videoaulas, simulados, redação e — o que só a gente entrega — um{" "}
              <strong className="text-white">cronograma de estudos personalizado</strong> que diz
              o que você tem que estudar hoje.
            </p>
          </div>

          {/* Direita — card de preço */}
          <div className="animate-fade-up">
            <div className="mx-auto max-w-sm rounded-3xl border border-white/15 bg-black/40 p-6 shadow-2xl backdrop-blur sm:p-8">
              <span className="inline-flex rounded-full border border-acerto/60 px-3 py-1 text-xs font-bold uppercase tracking-wide text-acerto">
                Acesso completo à plataforma
              </span>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">A partir de</p>
                <p className="flex items-end gap-1 leading-none">
                  <span className="mb-1.5 text-2xl font-bold">R$</span>
                  <span className="text-6xl font-extrabold sm:text-7xl">{PLANOS[0].preco.split(",")[0]}</span>
                  <span className="mb-1.5 text-2xl font-bold">,{PLANOS[0].preco.split(",")[1]}</span>
                  <span className="mb-2.5 ml-1 text-base font-semibold text-white/60">/mês</span>
                </p>
                <p className="mt-1.5 text-sm text-white/60">
                  ou R$ {PLANOS[1].preco}/trimestre · cancele quando quiser
                </p>
              </div>

              <ComprarAcesso
                plano="mensal"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-meta px-6 py-4 text-base font-extrabold uppercase tracking-wide text-brand-950 shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
              >
                Garantir meu acesso
              </ComprarAcesso>

              <ul className="mt-6 space-y-3">
                {CARD_DESTAQUES.map((b, idx) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-acerto text-xs font-black text-brand-950">
                      ✓
                    </span>
                    <span className={idx === 0 ? "font-bold text-white" : "font-medium text-white/85"}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAIXA QUE ROLA (marquee) =============== */}
      <div className="overflow-hidden border-y border-brand-900 bg-acerto py-3">
        <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap text-sm font-extrabold uppercase tracking-wide text-brand-950">
          {[0, 1].map((rep) =>
            TICKER.map((t, i) => (
              <span key={`${rep}-${i}`} className="flex items-center gap-6">
                <span>{t}</span>
                <span className="text-brand-950/40">●</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* =============== DIFERENCIAL: CRONOGRAMA (destaque) =========== */}
      <section className="border-b border-white/10 bg-brand-900 py-20 sm:py-24">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-acerto px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-950">
              ★ O que nos diferencia
            </span>
            <h2 className="mt-5 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              Um cronograma <span className="text-ciano">só seu</span>
            </h2>
            <p className="mt-5 text-lg text-white/75">
              Os outros te entregam um monte de aula solta e você se vira. Aqui é diferente: você
              recebe um <strong className="text-white">plano de estudos personalizado</strong> — diz
              quantas horas por dia tem, e a plataforma monta o seu caminho até a prova e mostra,
              todo dia, exatamente o que estudar.
            </p>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-5xl items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <ul className="space-y-4">
                {CRONOGRAMA_PONTOS.map(([t, d], i) => (
                  <li
                    key={t}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-ciano/40"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-acerto text-brand-950">
                      <Icon name="calendario" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold text-white">{t}</p>
                      <p className="mt-0.5 text-sm text-white/65">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <AgendaMock />
            </Reveal>
          </div>

          <Reveal className="mt-12 flex justify-center" delay={100}>
            <ComprarAcesso
              plano="mensal"
              className="rounded-xl bg-meta px-8 py-4 text-base font-extrabold uppercase tracking-wide text-brand-950 shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Quero meu cronograma personalizado
            </ComprarAcesso>
          </Reveal>
        </div>
      </section>

      {/* ===================== VEJA A PLATAFORMA ====================== */}
      <section className="border-b border-white/10 py-16 sm:py-20">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-widest text-ciano">
              Por dentro da plataforma
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Tudo organizado, do jeito que você precisa
            </h2>
            <p className="mt-4 max-w-md text-white/70">
              Abra no computador ou no celular e veja, todo dia, exatamente o que estudar: aula,
              questões, simulado ou redação. Sem se perder.
            </p>
            <Link
              href="#comprar"
              className="mt-8 inline-flex rounded-xl bg-meta px-7 py-4 text-base font-extrabold text-brand-950 shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Ver planos — a partir de R$ {PLANOS[0].preco}
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <PlataformaMac fallback={<ComputadorMockup />} />
          </Reveal>
        </div>
      </section>

      {/* ===================== IDEAL PARA VOCÊ QUE QUER ================ */}
      <section className="relative py-20">
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
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-ciano/40 hover:bg-white/10"
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
              className="rounded-xl bg-acerto px-8 py-4 text-base font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Assine agora
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============================ NÚMEROS ========================== */}
      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="container grid grid-cols-1 gap-6 py-10 sm:grid-cols-3">
          {NUMEROS.map((n, i) => (
            <Reveal key={n.r} delay={i * 90} className="text-center">
              <p className="text-4xl font-extrabold tracking-tight text-ciano">{n.v}</p>
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
                className={`group rounded-2xl border p-6 transition hover:-translate-y-1 ${
                  i === 0
                    ? "border-acerto/40 bg-acerto/10 hover:border-acerto"
                    : "border-white/10 bg-white/5 hover:border-ciano/40 hover:bg-white/[0.08]"
                }`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset transition ${
                    i === 0
                      ? "bg-acerto text-brand-950 ring-acerto"
                      : "bg-brand-600/30 text-ciano ring-ciano/30 group-hover:bg-ciano group-hover:text-brand-900"
                  }`}
                >
                  <Icon name={f.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{f.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= COMO FUNCIONA ====================== */}
      <section className="border-y border-white/10 bg-brand-900 py-20">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Comece em 3 passos
            </h2>
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
            {COMO.map((p, i) => (
              <Reveal key={p.n} delay={i * 110} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-xl font-extrabold text-white">
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
      <section id="depoimentos" className="scroll-mt-20 py-20">
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
                  <blockquote className="flex-1 text-sm leading-relaxed text-slate-700">
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
      <section id="comprar" className="scroll-mt-20 border-t border-white/10 bg-white/[0.03] py-20">
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
      <section className="py-20">
        <div className="container mx-auto max-w-2xl">
          <Reveal>
            <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
              Perguntas frequentes
            </h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <details className="group rounded-2xl border border-white/10 bg-white/5 p-5 [&_summary::-webkit-details-marker]:hidden">
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
      <section className="border-t border-white/10 py-20">
        <div className="container">
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-brand-900 px-8 py-16 text-center shadow-2xl sm:px-16">
            <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              {OFERTA.promessa}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/75">
              Comece hoje com um cronograma feito só para você e estude com foco até o dia da prova.
              Planos a partir de R$ {PLANOS[0].preco} por mês, cancele quando quiser.
            </p>
            <div className="relative mt-8 flex justify-center">
              <Link
                href="#comprar"
                className="rounded-xl bg-meta px-8 py-4 text-base font-extrabold text-brand-900 shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
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
