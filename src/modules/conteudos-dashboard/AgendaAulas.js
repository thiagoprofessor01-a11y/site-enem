"use client";

import Link from "next/link";
import NivelDots from "@/components/NivelDots";
import Icon from "@/components/Icon";
import { areaInfo } from "./conteudos-ui";

function formatarDiaSemana(iso) {
  const d = new Date(iso + "T00:00:00");
  const txt = d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
  return txt.replace(".", "").replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Agenda de estudos: as aulas de hoje (em destaque) e os próximos dias.
 * Usada tanto na tela inicial do aluno quanto na aba Cronograma.
 */
export default function AgendaAulas({ agenda, hoje }) {
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
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-slate-900">Suas aulas de hoje</h2>
        </div>

        {hojeDia && hojeDia.aulas.length > 0 ? (
          <div className="space-y-3">
            {hojeDia.aulas.map((aula) => {
              const info = areaInfo(aula.areaSlug);
              return (
                <div
                  key={aula.id}
                  className={`card flex flex-col gap-3 border ${info.border} p-4 shadow-card sm:flex-row sm:items-center sm:p-5`}
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
                  {/* Escolha: assistir a aula ou responder as questões */}
                  <span className="flex shrink-0 gap-2">
                    <Link
                      href={`/conteudos/${aula.materiaId}/${aula.id}`}
                      className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-600 sm:flex-none"
                    >
                      Aula
                    </Link>
                    <Link
                      href={`/questoes/${aula.materiaId}/${aula.id}`}
                      className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
                    >
                      Questões
                    </Link>
                  </span>
                </div>
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
