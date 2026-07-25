"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "@/modules/admin/admin-store";
import { areaInfo, ORDEM_AREAS } from "./conteudos-ui";

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
    return <div className="container py-16 text-center text-slate-400">Carregando…</div>;
  }

  const contarModulos = (mId) => db.modulos.filter((m) => m.materiaId === mId).length;
  const contarAulas = (mId) => {
    const modIds = db.modulos.filter((m) => m.materiaId === mId).map((m) => m.id);
    return db.aulas.filter((a) => modIds.includes(a.moduloId)).length;
  };

  const porArea = ORDEM_AREAS.map((area) => ({
    area,
    materias: db.materias.filter((m) => m.area === area),
  })).filter((g) => g.materias.length > 0);

  return (
    <div className="container max-w-5xl py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Conteúdos</h1>
        <p className="mt-2 text-slate-600">
          Estude por matéria, do que mais cai para o que menos cai. Cada tópico traz
          um resumo e as videoaulas selecionadas.
        </p>
      </header>

      {porArea.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          Nenhum conteúdo cadastrado ainda.
        </div>
      ) : (
        <div className="space-y-12">
          {porArea.map(({ area, materias }) => {
            const info = areaInfo(area);
            return (
              <section key={area}>
                <div className="mb-4 flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${info.grad} text-lg text-white shadow-sm`}>
                    {info.emoji}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">{info.nome}</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {materias.map((m) => (
                    <Link
                      key={m.id}
                      href={`/conteudos/${m.id}`}
                      className={`card group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-card-hover ${info.ring}`}
                    >
                      <span className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${info.grad}`} />
                      <h3 className="mt-1 text-lg font-bold text-slate-900">{m.nome}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {plural(contarModulos(m.id), "módulo", "módulos")} ·{" "}
                        {plural(contarAulas(m.id), "aula", "aulas")}
                      </p>
                      <span className={`mt-4 inline-flex items-center gap-1 text-sm font-bold ${info.text}`}>
                        Estudar →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
