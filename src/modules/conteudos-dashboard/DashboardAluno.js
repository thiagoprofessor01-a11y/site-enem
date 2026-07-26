"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "@/modules/admin/admin-store";
import { useSessao } from "@/modules/auth/auth";
import Icon from "@/components/Icon";
import { carregarCronograma, diasCorridos, hojeISO } from "@/modules/auth-cronograma/cronograma-storage";
import { montarAgenda } from "@/modules/auth-cronograma/cronograma-engine";
import { useConcluidas } from "./progresso";
import AgendaAulas from "./AgendaAulas";

const ATALHOS = [
  { href: "/conteudos", titulo: "Conteúdos", icon: "livro", cor: "bg-blue-600" },
  { href: "/questoes", titulo: "Questões", icon: "lista", cor: "bg-emerald-600" },
  { href: "/redacao", titulo: "Redação", icon: "lapis", cor: "bg-rose-600" },
  { href: "/cronograma", titulo: "Cronograma", icon: "calendario", cor: "bg-amber-600" },
];

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
      {cronograma && <AgendaAulas agenda={agenda} hoje={hoje} />}

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
