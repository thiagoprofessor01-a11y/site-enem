"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "@/modules/admin/admin-store";
import { useSessao } from "@/modules/auth/auth";
import NivelDots from "@/components/NivelDots";
import { carregarCronograma, diasCorridos, hojeISO } from "@/modules/auth-cronograma/cronograma-storage";
import { montarAgenda } from "@/modules/auth-cronograma/cronograma-engine";
import { useConcluidas } from "./progresso";

const ATALHOS = [
  { href: "/conteudos", titulo: "Conteúdos", emoji: "📚" },
  { href: "/questoes", titulo: "Questões", emoji: "📝" },
  { href: "/redacao", titulo: "Redação", emoji: "✍️" },
  { href: "/cronograma", titulo: "Cronograma", emoji: "🗓️" },
];

function formatarDiaSemana(iso) {
  const d = new Date(iso + "T00:00:00");
  const txt = d.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  return txt.replace(".", "").replace(/^\w/, (c) => c.toUpperCase());
}

export default function DashboardAluno() {
  const sessao = useSessao();
  const concluidas = useConcluidas();
  const [cronograma, setCronograma] = useState(undefined);
  const [db, setDb] = useState(null);

  useEffect(() => {
    setCronograma(carregarCronograma());
    let ativo = true;
    fetchAll()
      .then((d) => ativo && setDb(d))
      .catch(() => ativo && setDb({ materias: [], modulos: [], aulas: [], videos: [], questoes: [] }));
    return () => {
      ativo = false;
    };
  }, []);

  const nome = sessao?.nome?.split(" ")[0] || "estudante";
  const hoje = hojeISO();

  return (
    <div className="container max-w-3xl py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Olá, {nome} 👋
        </h1>
        {cronograma && (
          <p className="mt-1 text-slate-600">
            Faltam <strong>{diasCorridos(hoje, cronograma.dataEnem)} dias</strong>{" "}
            para o ENEM. Bora estudar?
          </p>
        )}
      </header>

      {/* Sem cronograma → convite para montar */}
      {cronograma === null && (
        <div className="card p-8 text-center">
          <span className="text-4xl">🗓️</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">
            Monte seu cronograma
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Diga quantas horas por dia você tem e a gente monta um plano de aulas
            priorizando o que mais cai no ENEM — com as aulas do seu dia.
          </p>
          <Link href="/cronograma" className="btn-primary mt-6">
            Criar meu cronograma
          </Link>
        </div>
      )}

      {/* Com cronograma → agenda do dia + próximos */}
      {cronograma && (
        <Agenda
          cronograma={cronograma}
          db={db}
          hoje={hoje}
          concluidas={concluidas || []}
        />
      )}

      {/* Atalhos */}
      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Atalhos
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ATALHOS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="card flex flex-col items-center gap-1 p-4 text-center text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
            >
              <span className="text-2xl">{a.emoji}</span>
              {a.titulo}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Agenda({ cronograma, db, hoje, concluidas }) {
  if (!db) {
    return (
      <div className="card p-6 text-center text-sm text-slate-400">
        Carregando suas aulas…
      </div>
    );
  }

  const { plano, dias } = montarAgenda(cronograma, db, concluidas);
  const futuros = dias.filter((d) => d.data >= hoje);
  const hojeDia = futuros.find((d) => d.data === hoje);
  const proximos = futuros.filter((d) => d.data > hoje).slice(0, 5);

  // Progresso: aulas do plano já concluídas.
  const idsPlano = plano.areas.flatMap((a) =>
    a.materias.flatMap((m) => m.selecionadas.map((au) => au.id))
  );
  const feitasSet = new Set(concluidas);
  const totalPlano = idsPlano.length;
  const feitas = idsPlano.filter((id) => feitasSet.has(id)).length;
  const pct = totalPlano ? Math.round((feitas / totalPlano) * 100) : 0;

  const barra =
    totalPlano > 0 ? (
      <div className="card mb-6 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-900">Seu progresso</span>
          <span className="text-slate-500">
            {feitas} de {totalPlano} aulas ({pct}%)
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    ) : null;

  if (futuros.length === 0) {
    return (
      <>
        {barra}
        <div className="card p-8 text-center">
          <span className="text-4xl">🎉</span>
          <h2 className="mt-3 text-lg font-bold text-slate-900">
            Você concluiu todas as aulas do plano!
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Que tal revisar os conteúdos que mais caem ou fazer alguns simulados?
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {barra}

      {/* HOJE — destaque */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">Suas aulas de hoje</h2>
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            Hoje
          </span>
        </div>

        {hojeDia && hojeDia.aulas.length > 0 ? (
          <div className="space-y-3">
            {hojeDia.aulas.map((aula) => (
              <Link
                key={aula.id}
                href={`/conteudos/${aula.materiaId}/${aula.id}`}
                className="card group flex items-center gap-4 border-brand-200 p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-xl text-white">
                  ▶
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {aula.areaNome} · {aula.materiaNome}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <span className="truncate text-base font-semibold text-slate-900">
                      {aula.titulo}
                    </span>
                    <NivelDots nivel={aula.nivel} />
                  </span>
                  <span className="block truncate text-xs text-slate-400">
                    {aula.modNome}
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-brand-600 transition group-hover:translate-x-0.5">
                  Estudar →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-sm text-slate-500">
            Hoje é dia de descanso 🌿 — aproveite para recarregar as energias.
          </div>
        )}
      </section>

      {/* PRÓXIMOS DIAS — menos destaque */}
      {proximos.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Próximos dias
          </h2>
          <div className="space-y-3">
            {proximos.map((dia) => (
              <div key={dia.data} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">
                  {formatarDiaSemana(dia.data)}
                </p>
                <ul className="mt-2 space-y-1">
                  {dia.aulas.map((aula) => (
                    <li key={aula.id}>
                      <Link
                        href={`/conteudos/${aula.materiaId}/${aula.id}`}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
                      >
                        <span className="truncate">
                          <span className="text-slate-400">{aula.materiaNome}:</span>{" "}
                          {aula.titulo}
                        </span>
                        <NivelDots nivel={aula.nivel} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
