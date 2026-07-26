"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "@/modules/admin/admin-store";
import { useSessao } from "@/modules/auth/auth";
import NivelDots from "@/components/NivelDots";
import Icon from "@/components/Icon";
import { carregarCronograma, diasCorridos, hojeISO } from "@/modules/auth-cronograma/cronograma-storage";
import { montarAgenda } from "@/modules/auth-cronograma/cronograma-engine";
import { useConcluidas } from "./progresso";
import { areaInfo } from "./conteudos-ui";

const ATALHOS = [
  { href: "/conteudos", titulo: "Conteúdos", icon: "livro", cor: "bg-blue-600" },
  { href: "/questoes", titulo: "Questões", icon: "lista", cor: "bg-emerald-600" },
  { href: "/redacao", titulo: "Redação", icon: "lapis", cor: "bg-rose-600" },
  { href: "/cronograma", titulo: "Cronograma", icon: "calendario", cor: "bg-amber-600" },
];

function formatarDiaSemana(iso) {
  const d = new Date(iso + "T00:00:00");
  const txt = d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
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

  // Progresso (quando há cronograma + conteúdo carregado).
  let progresso = null;
  let agenda = null;
  if (cronograma && db) {
    agenda = montarAgenda(cronograma, db, concluidas || []);
    const ids = agenda.plano.areas.flatMap((a) =>
      a.materias.flatMap((m) => m.selecionadas.map((au) => au.id))
    );
    const feitasSet = new Set(concluidas || []);
    const total = ids.length;
    const feitas = ids.filter((id) => feitasSet.has(id)).length;
    progresso = { total, feitas, pct: total ? Math.round((feitas / total) * 100) : 0 };
  }

  return (
    <div className="container max-w-3xl py-8">
      {/* HERO */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Olá, {nome}
        </h1>
        {cronograma ? (
          <p className="mt-1 text-slate-300">
            Faltam <strong className="text-white">{diasCorridos(hoje, cronograma.dataEnem)} dias</strong> para o ENEM.
          </p>
        ) : (
          <p className="mt-1 text-slate-300">Vamos montar seu plano de estudos?</p>
        )}

        {progresso && progresso.total > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-white">Seu progresso</span>
              <span className="text-slate-300">
                {progresso.feitas} de {progresso.total} aulas · {progresso.pct}%
              </span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${progresso.pct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sem cronograma → convite */}
      {cronograma === null && (
        <div className="card mt-6 p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-3xl">
            🗓️
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Monte seu cronograma</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Diga quantas horas por dia você tem e a gente monta um plano priorizando o que mais cai no ENEM — com as aulas do seu dia.
          </p>
          <Link href="/cronograma" className="btn-primary mt-6">
            Criar meu cronograma
          </Link>
        </div>
      )}

      {/* Agenda */}
      {cronograma && <Agenda agenda={agenda} hoje={hoje} />}

      {/* Atalhos */}
      <section className="mt-10">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Atalhos</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ATALHOS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="card group flex flex-col items-center gap-2 p-4 text-center text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.cor} text-white`}>
                <Icon name={a.icon} />
              </span>
              {a.titulo}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Agenda({ agenda, hoje }) {
  if (!agenda) {
    return (
      <div className="card mt-6 p-6 text-center text-sm text-slate-400">
        Carregando suas aulas…
      </div>
    );
  }

  const futuros = agenda.dias.filter((d) => d.data >= hoje);
  const hojeDia = futuros.find((d) => d.data === hoje);
  const proximos = futuros.filter((d) => d.data > hoje).slice(0, 5);

  if (futuros.length === 0) {
    return (
      <div className="card mt-6 p-8 text-center">
        <span className="text-4xl">🎉</span>
        <h2 className="mt-3 text-lg font-bold text-slate-900">
          Você concluiu todas as aulas do plano!
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Que tal revisar os conteúdos que mais caem ou fazer alguns simulados?
        </p>
      </div>
    );
  }

  return (
    <>
      {/* HOJE — destaque */}
      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-slate-900">Suas aulas de hoje</h2>
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold uppercase text-brand-700">
            Hoje
          </span>
        </div>

        {hojeDia && hojeDia.aulas.length > 0 ? (
          <div className="space-y-3">
            {hojeDia.aulas.map((aula) => {
              const info = areaInfo(aula.areaSlug);
              return (
                <Link
                  key={aula.id}
                  href={`/conteudos/${aula.materiaId}/${aula.id}`}
                  className={`card group flex items-center gap-4 border ${info.border} p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover sm:p-5`}
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${info.solid} text-white`}>
                    <Icon name="play" className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`text-xs font-bold uppercase tracking-wide ${info.text}`}>
                      {aula.materiaNome}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="truncate text-base font-bold text-slate-900">
                        {aula.titulo}
                      </span>
                      <NivelDots nivel={aula.nivel} />
                    </span>
                    <span className="block truncate text-xs text-slate-400">{aula.modNome}</span>
                  </span>
                  <span className="hidden shrink-0 items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-brand-600 sm:flex">
                    Estudar →
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="card p-6 text-center text-sm text-slate-500">
            Hoje é dia de descanso — aproveite para recarregar as energias.
          </div>
        )}
      </section>

      {/* PRÓXIMOS DIAS */}
      {proximos.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Próximos dias
          </h2>
          <div className="space-y-3">
            {proximos.map((dia) => (
              <div key={dia.data} className="card p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {formatarDiaSemana(dia.data)}
                </p>
                <ul className="mt-2 space-y-1">
                  {dia.aulas.map((aula) => {
                    const info = areaInfo(aula.areaSlug);
                    return (
                      <li key={aula.id}>
                        <Link
                          href={`/conteudos/${aula.materiaId}/${aula.id}`}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
                        >
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${info.solid}`} />
                          <span className="truncate">
                            <span className={`font-semibold ${info.text}`}>{aula.materiaNome}:</span>{" "}
                            {aula.titulo}
                          </span>
                          <NivelDots nivel={aula.nivel} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
