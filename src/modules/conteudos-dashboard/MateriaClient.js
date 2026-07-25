"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "@/modules/admin/admin-store";
import HtmlEmbed from "@/components/HtmlEmbed";
import { AREA_INFO } from "./conteudos-ui";

const LETRAS = ["A", "B", "C", "D", "E"];

// Questão estruturada (formato = 'form') para o aluno: clica na alternativa e
// vê se acertou. As questões em HTML têm a própria correção embutida.
function QuestaoEstruturada({ questao }) {
  const [escolhida, setEscolhida] = useState(null);
  const respondida = escolhida !== null;
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-sm font-medium text-slate-800">{questao.enunciado}</p>
      <ul className="mt-3 space-y-2">
        {questao.alternativas.map((alt, idx) =>
          alt ? (
            <li key={idx}>
              <button
                type="button"
                disabled={respondida}
                onClick={() => setEscolhida(idx)}
                className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                  respondida && idx === questao.correta
                    ? "border-green-300 bg-green-50 text-green-800"
                    : respondida && idx === escolhida
                    ? "border-red-300 bg-red-50 text-red-800"
                    : "border-slate-200 hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                <span className="font-semibold">{LETRAS[idx]})</span>
                <span>{alt}</span>
              </button>
            </li>
          ) : null
        )}
      </ul>
      {respondida && (
        <p
          className={`mt-3 text-sm font-semibold ${
            escolhida === questao.correta ? "text-green-700" : "text-red-600"
          }`}
        >
          {escolhida === questao.correta
            ? "✓ Você acertou!"
            : `✗ Resposta correta: ${LETRAS[questao.correta]}`}
        </p>
      )}
    </div>
  );
}

export default function MateriaClient({ materiaId }) {
  const [db, setDb] = useState(null);
  const [aulaAberta, setAulaAberta] = useState(null);

  useEffect(() => {
    let ativo = true;
    fetchAll()
      .then((d) => ativo && setDb(d))
      .catch(() => ativo && setDb(null));
    return () => {
      ativo = false;
    };
  }, []);

  if (!db) {
    return (
      <div className="container py-16 text-center text-slate-400">Carregando…</div>
    );
  }

  const materia = db.materias.find((m) => m.id === materiaId);
  if (!materia) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <p className="text-slate-500">Matéria não encontrada.</p>
        <Link href="/conteudos" className="mt-4 inline-block text-sm font-semibold text-brand-600">
          ← Voltar para Conteúdos
        </Link>
      </div>
    );
  }

  const modulos = db.modulos.filter((m) => m.materiaId === materia.id);

  return (
    <div className="container max-w-3xl py-12">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1 text-sm">
        <Link href="/conteudos" className="font-medium text-brand-600 hover:text-brand-700">
          Conteúdos
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900">{materia.nome}</span>
      </nav>

      <header className="mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
          {AREA_INFO[materia.area]?.emoji || "📚"}
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {materia.nome}
          </h1>
          <p className="text-sm text-slate-500">
            {AREA_INFO[materia.area]?.nome || materia.area}
          </p>
        </div>
      </header>

      {modulos.length === 0 ? (
        <p className="text-slate-400">Nenhum módulo cadastrado nesta matéria.</p>
      ) : (
        <div className="space-y-8">
          {modulos.map((mod) => {
            const aulas = db.aulas.filter((a) => a.moduloId === mod.id);
            return (
              <section key={mod.id}>
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {mod.nome}
                  </h2>
                  {mod.descricao && (
                    <p className="text-sm text-slate-500">{mod.descricao}</p>
                  )}
                </div>
                <ul className="space-y-2">
                  {aulas.map((aula) => {
                    const aberta = aulaAberta === aula.id;
                    const videos = db.videos.filter((v) => v.aulaId === aula.id);
                    const questoes = db.questoes.filter((q) => q.aulaId === aula.id);
                    return (
                      <li key={aula.id} className="card overflow-hidden">
                        <button
                          onClick={() => setAulaAberta(aberta ? null : aula.id)}
                          className="flex w-full items-center justify-between gap-3 p-4 text-left"
                        >
                          <span className="min-w-0">
                            <span className="block font-medium text-slate-900">
                              {aula.titulo}
                            </span>
                            {aula.resumo && !aberta && (
                              <span className="mt-0.5 block truncate text-xs text-slate-500">
                                {aula.resumo}
                              </span>
                            )}
                          </span>
                          <span
                            className={`shrink-0 text-brand-600 transition ${
                              aberta ? "rotate-180" : ""
                            }`}
                          >
                            ▾
                          </span>
                        </button>

                        {aberta && (
                          <div className="border-t border-slate-100 p-4">
                            {aula.resumo && (
                              <p className="text-sm leading-relaxed text-slate-600">
                                {aula.resumo}
                              </p>
                            )}
                            {videos.length > 0 ? (
                              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {videos.map((v) => (
                                  <figure key={v.id}>
                                    <div className="aspect-video overflow-hidden rounded-lg bg-slate-100">
                                      <iframe
                                        className="h-full w-full"
                                        src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                                        title={v.titulo}
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      />
                                    </div>
                                    <figcaption className="mt-1.5 text-xs font-medium text-slate-600">
                                      {v.titulo}
                                    </figcaption>
                                  </figure>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-3 text-xs text-slate-400">
                                Videoaulas em breve para este tópico.
                              </p>
                            )}

                            {questoes.length > 0 && (
                              <div className="mt-6">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                  Questionário
                                </h3>
                                <div className="space-y-4">
                                  {questoes.map((q, i) => (
                                    <div key={q.id}>
                                      {q.enunciado && (
                                        <p className="mb-1 text-sm font-semibold text-slate-700">
                                          {i + 1}. {q.enunciado}
                                        </p>
                                      )}
                                      {q.formato === "html" ? (
                                        <div className="overflow-hidden rounded-lg border border-slate-200">
                                          <HtmlEmbed html={q.html} />
                                        </div>
                                      ) : (
                                        <QuestaoEstruturada questao={q} />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
