"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "@/modules/admin/admin-store";
import Icon from "@/components/Icon";
import { areaInfo, ORDEM_AREAS } from "./conteudos-ui";

const plural = (n, um, muitos) => `${n} ${n === 1 ? um : muitos}`;

export default function ConteudosClient({
  base = "/conteudos",
  titulo = "Conteúdos",
  subtitulo = "Estude por matéria, do que mais cai para o que menos cai.",
}) {
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
    <div className="container max-w-2xl py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{titulo}</h1>
        <p className="mx-auto mt-2 max-w-lg text-slate-600">{subtitulo}</p>
      </header>

      {porArea.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          Nenhum conteúdo cadastrado ainda.
        </div>
      ) : (
        <div className="space-y-10">
          {porArea.map(({ area, materias }) => {
            const info = areaInfo(area);
            return (
              <section key={area}>
                {/* Cabeçalho da área — centralizado */}
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${info.solid} text-white`}>
                    <Icon name={info.icon} className="h-4 w-4" />
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    {info.nome}
                  </h2>
                </div>

                {/* Banners das matérias */}
                <div className="space-y-4">
                  {materias.map((m) => (
                    <Link
                      key={m.id}
                      href={`${base}/${m.id}`}
                      className="card group block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card-hover"
                    >
                      <div className="relative aspect-[16/6] w-full">
                        {m.banner ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.banner} alt={m.nome} className="h-full w-full object-cover" />
                        ) : (
                          <div className={`flex h-full w-full items-center justify-center ${info.solid}`}>
                            <Icon name={info.icon} className="h-10 w-10 text-white/90" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                          <div>
                            <span className="block text-lg font-extrabold text-white drop-shadow">{m.nome}</span>
                            <span className="block text-xs font-medium text-white/85">
                              {plural(contarModulos(m.id), "módulo", "módulos")} ·{" "}
                              {plural(contarAulas(m.id), "aula", "aulas")}
                            </span>
                          </div>
                          <span className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-bold text-slate-900 opacity-0 transition group-hover:opacity-100">
                            Estudar →
                          </span>
                        </div>
                      </div>
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
