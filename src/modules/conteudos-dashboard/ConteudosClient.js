"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "@/modules/admin/admin-store";
import { AREA_INFO, ORDEM_AREAS } from "./conteudos-ui";

const plural = (n, um, muitos) => `${n} ${n === 1 ? um : muitos}`;

export default function ConteudosClient() {
  const [db, setDb] = useState(null);

  useEffect(() => {
    let ativo = true;
    fetchAll()
      .then((d) => ativo && setDb(d))
      .catch(() => ativo && setDb({ materias: [], modulos: [], aulas: [] }));
    return () => {
      ativo = false;
    };
  }, []);

  if (!db) {
    return (
      <div className="container py-16 text-center text-slate-400">Carregando…</div>
    );
  }

  const contarModulos = (mId) =>
    db.modulos.filter((m) => m.materiaId === mId).length;
  const contarAulas = (mId) => {
    const modIds = db.modulos
      .filter((m) => m.materiaId === mId)
      .map((m) => m.id);
    return db.aulas.filter((a) => modIds.includes(a.moduloId)).length;
  };

  const porArea = ORDEM_AREAS.map((area) => ({
    area,
    materias: db.materias.filter((m) => m.area === area),
  })).filter((g) => g.materias.length > 0);

  return (
    <div className="container max-w-5xl py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Conteúdos
        </h1>
        <p className="mt-2 text-slate-600">
          Estude por matéria, do que mais cai para o que menos cai. Cada tópico
          traz um resumo e as videoaulas selecionadas.
        </p>
      </header>

      {porArea.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          Nenhum conteúdo cadastrado ainda.
        </div>
      ) : (
        <div className="space-y-10">
          {porArea.map(({ area, materias }) => (
            <section key={area}>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                <span className="text-lg">{AREA_INFO[area]?.emoji}</span>
                {AREA_INFO[area]?.nome || area}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {materias.map((m) => (
                  <Link
                    key={m.id}
                    href={`/conteudos/${m.id}`}
                    className="card group flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">
                      {m.nome}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {plural(contarModulos(m.id), "módulo", "módulos")} ·{" "}
                      {plural(contarAulas(m.id), "aula", "aulas")}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-brand-600">
                      Estudar →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
