"use client";

import { useEffect, useState } from "react";
import {
  AREAS_MATERIA,
  LETRAS,
  fetchAll,
  backendLabel,
  addMateria,
  updateMateria,
  deleteMateria,
  addModulo,
  updateModulo,
  deleteModulo,
  addAula,
  updateAula,
  deleteAula,
  addVideo,
  deleteVideo,
  addQuestao,
  deleteQuestao,
  parseYouTubeId,
  areaNome,
} from "./admin-store";
import { Campo, inputClass, Botao, CardVazio, Tag } from "./ui";
import HtmlEmbed from "@/components/HtmlEmbed";
import NivelDots from "@/components/NivelDots";

export default function AdminApp() {
  const [db, setDb] = useState(null);
  const [nav, setNav] = useState({}); // { materiaId, moduloId, aulaId }

  useEffect(() => {
    let ativo = true;
    fetchAll()
      .then((d) => ativo && setDb(d))
      .catch(() => ativo && setDb({ materias: [], modulos: [], aulas: [], videos: [], questoes: [] }));
    return () => {
      ativo = false;
    };
  }, []);

  if (!db) {
    return (
      <div className="container py-16 text-center text-slate-400">Carregando…</div>
    );
  }

  const materia = db.materias.find((m) => m.id === nav.materiaId);
  const modulo = db.modulos.find((m) => m.id === nav.moduloId);
  const aula = db.aulas.find((a) => a.id === nav.aulaId);

  const crumbs = [{ label: "Matérias", onClick: () => setNav({}) }];
  if (materia)
    crumbs.push({
      label: materia.nome,
      onClick: () => setNav({ materiaId: materia.id }),
    });
  if (modulo)
    crumbs.push({
      label: modulo.nome,
      onClick: () => setNav({ materiaId: materia.id, moduloId: modulo.id }),
    });
  if (aula) crumbs.push({ label: aula.titulo, onClick: null });

  return (
    <div className="container max-w-4xl py-10">
      <Cabecalho db={db} />
      <Breadcrumb crumbs={crumbs} />

      {aula ? (
        <AulaDetalhe db={db} aula={aula} setDb={setDb} />
      ) : modulo ? (
        <AulasView
          db={db}
          modulo={modulo}
          setDb={setDb}
          abrir={(a) =>
            setNav({ materiaId: materia.id, moduloId: modulo.id, aulaId: a.id })
          }
        />
      ) : materia ? (
        <ModulosView
          db={db}
          materia={materia}
          setDb={setDb}
          abrir={(m) => setNav({ materiaId: materia.id, moduloId: m.id })}
        />
      ) : (
        <MateriasView
          db={db}
          setDb={setDb}
          abrir={(m) => setNav({ materiaId: m.id })}
        />
      )}
    </div>
  );
}

/* ==================================================================== */
/* Cabeçalho + breadcrumb                                               */
/* ==================================================================== */
function Cabecalho({ db }) {
  const stats = [
    { n: db.materias.length, r: "matérias" },
    { n: db.modulos.length, r: "módulos" },
    { n: db.aulas.length, r: "aulas" },
    { n: db.videos.length, r: "vídeos" },
    { n: db.questoes.length, r: "questões" },
  ];
  const conectado = backendLabel() === "supabase";
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-xl text-white">
            ⚙️
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Painel de administração
            </h1>
            <p className="text-sm text-slate-500">
              Cadastre matérias, módulos, aulas, vídeos e questionários.
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            conectado
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {conectado
            ? "● Conectado ao banco (Supabase)"
            : "● Salvando neste navegador"}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.r} className="card px-3 py-3 text-center">
            <p className="text-xl font-bold tabular-nums text-slate-900">{s.n}</p>
            <p className="text-xs text-slate-500">{s.r}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Breadcrumb({ crumbs }) {
  return (
    <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-slate-300">/</span>}
          {c.onClick ? (
            <button
              onClick={c.onClick}
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              {c.label}
            </button>
          ) : (
            <span className="font-semibold text-slate-900">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ==================================================================== */
/* Matérias                                                             */
/* ==================================================================== */
function MateriasView({ db, setDb, abrir }) {
  const [form, setForm] = useState(null); // null | 'novo' | id

  return (
    <Secao
      titulo="Matérias"
      acao={
        form !== "novo" && (
          <Botao onClick={() => setForm("novo")}>+ Nova matéria</Botao>
        )
      }
    >
      {form === "novo" && (
        <MateriaForm
          onSalvar={async (dados) => {
            setDb(await addMateria(dados));
            setForm(null);
          }}
          onCancelar={() => setForm(null)}
        />
      )}

      {db.materias.length === 0 && form !== "novo" ? (
        <CardVazio>Nenhuma matéria ainda. Crie a primeira.</CardVazio>
      ) : (
        <ul className="space-y-2">
          {db.materias.map((m) =>
            form === m.id ? (
              <MateriaForm
                key={m.id}
                inicial={m}
                onSalvar={async (dados) => {
                  setDb(await updateMateria(m.id, dados));
                  setForm(null);
                }}
                onCancelar={() => setForm(null)}
              />
            ) : (
              <ItemLinha
                key={m.id}
                titulo={m.nome}
                tag={areaNome(m.area)}
                sub={`${db.modulos.filter((x) => x.materiaId === m.id).length} módulo(s)`}
                onAbrir={() => abrir(m)}
                onEditar={() => setForm(m.id)}
                onExcluir={async () => {
                  if (confirm(`Excluir "${m.nome}" e todo o seu conteúdo?`))
                    setDb(await deleteMateria(m.id));
                }}
              />
            )
          )}
        </ul>
      )}
    </Secao>
  );
}

function MateriaForm({ inicial, onSalvar, onCancelar }) {
  const [nome, setNome] = useState(inicial?.nome || "");
  const [area, setArea] = useState(inicial?.area || AREAS_MATERIA[0].slug);
  const [banner, setBanner] = useState(inicial?.banner || "");
  return (
    <FormCard
      onSubmit={() => nome.trim() && onSalvar({ nome, area, banner })}
      onCancelar={onCancelar}
    >
      <Campo label="Nome da matéria">
        <input
          autoFocus
          className={inputClass()}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex.: Matemática"
        />
      </Campo>
      <Campo label="Área de conhecimento">
        <select
          className={inputClass()}
          value={area}
          onChange={(e) => setArea(e.target.value)}
        >
          {AREAS_MATERIA.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.nome}
            </option>
          ))}
        </select>
      </Campo>
      <Campo label="Banner (URL de uma imagem) — opcional">
        <input
          className={inputClass()}
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
          placeholder="https://.../banner-matematica.jpg"
        />
      </Campo>
      {banner.trim() && (
        <div className="aspect-[16/6] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner} alt="Prévia do banner" className="h-full w-full object-cover" />
        </div>
      )}
    </FormCard>
  );
}

/* ==================================================================== */
/* Módulos                                                              */
/* ==================================================================== */
function ModulosView({ db, materia, setDb, abrir }) {
  const [form, setForm] = useState(null);
  const modulos = db.modulos.filter((m) => m.materiaId === materia.id);

  return (
    <Secao
      titulo={`Módulos de ${materia.nome}`}
      acao={
        form !== "novo" && (
          <Botao onClick={() => setForm("novo")}>+ Novo módulo</Botao>
        )
      }
    >
      {form === "novo" && (
        <ModuloForm
          onSalvar={async (dados) => {
            setDb(await addModulo(materia.id, dados));
            setForm(null);
          }}
          onCancelar={() => setForm(null)}
        />
      )}
      {modulos.length === 0 && form !== "novo" ? (
        <CardVazio>Nenhum módulo nesta matéria ainda.</CardVazio>
      ) : (
        <ul className="space-y-2">
          {modulos.map((m) =>
            form === m.id ? (
              <ModuloForm
                key={m.id}
                inicial={m}
                onSalvar={async (dados) => {
                  setDb(await updateModulo(m.id, dados));
                  setForm(null);
                }}
                onCancelar={() => setForm(null)}
              />
            ) : (
              <ItemLinha
                key={m.id}
                titulo={m.nome}
                nivel={m.nivel}
                sub={
                  (m.descricao ? m.descricao + " · " : "") +
                  `${db.aulas.filter((x) => x.moduloId === m.id).length} aula(s)`
                }
                onAbrir={() => abrir(m)}
                onEditar={() => setForm(m.id)}
                onExcluir={async () => {
                  if (confirm(`Excluir o módulo "${m.nome}"?`))
                    setDb(await deleteModulo(m.id));
                }}
              />
            )
          )}
        </ul>
      )}
    </Secao>
  );
}

function ModuloForm({ inicial, onSalvar, onCancelar }) {
  const [nome, setNome] = useState(inicial?.nome || "");
  const [descricao, setDescricao] = useState(inicial?.descricao || "");
  const [nivel, setNivel] = useState(inicial?.nivel ?? 3);
  return (
    <FormCard
      onSubmit={() => nome.trim() && onSalvar({ nome, descricao, nivel })}
      onCancelar={onCancelar}
    >
      <Campo label="Nome do módulo">
        <input
          autoFocus
          className={inputClass()}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex.: Funções"
        />
      </Campo>
      <NivelPicker value={nivel} onChange={setNivel} />
      <Campo label="Observação (opcional)">
        <input
          className={inputClass()}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Nota curta sobre o módulo (opcional)"
        />
      </Campo>
    </FormCard>
  );
}

/* ==================================================================== */
/* Aulas                                                                */
/* ==================================================================== */
function AulasView({ db, modulo, setDb, abrir }) {
  const [form, setForm] = useState(null);
  const aulas = db.aulas
    .filter((a) => a.moduloId === modulo.id)
    .sort((a, b) => (b.nivel ?? 3) - (a.nivel ?? 3) || (a.ordem ?? 0) - (b.ordem ?? 0));

  // Move a aula i para cima/baixo, apenas se a vizinha tiver o mesmo nível.
  async function mover(i, dir) {
    const j = dir === "cima" ? i - 1 : i + 1;
    if (j < 0 || j >= aulas.length) return;
    if ((aulas[i].nivel ?? 3) !== (aulas[j].nivel ?? 3)) return;
    const nova = [...aulas];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    let result;
    for (let k = 0; k < nova.length; k++) {
      result = await updateAula(nova[k].id, { ordem: k + 1 });
    }
    setDb(result);
  }

  const podeMover = (i, dir) => {
    const j = dir === "cima" ? i - 1 : i + 1;
    return j >= 0 && j < aulas.length && (aulas[i].nivel ?? 3) === (aulas[j].nivel ?? 3);
  };

  return (
    <Secao
      titulo={`Aulas de ${modulo.nome}`}
      acao={
        form !== "novo" && (
          <Botao onClick={() => setForm("novo")}>+ Nova aula</Botao>
        )
      }
    >
      {form === "novo" && (
        <AulaForm
          onSalvar={async (dados) => {
            setDb(await addAula(modulo.id, dados));
            setForm(null);
          }}
          onCancelar={() => setForm(null)}
        />
      )}
      {aulas.length === 0 && form !== "novo" ? (
        <CardVazio>Nenhuma aula neste módulo ainda.</CardVazio>
      ) : (
        <ul className="space-y-2">
          {aulas.map((a, i) =>
            form === a.id ? (
              <AulaForm
                key={a.id}
                inicial={a}
                onSalvar={async (dados) => {
                  setDb(await updateAula(a.id, dados));
                  setForm(null);
                }}
                onCancelar={() => setForm(null)}
              />
            ) : (
              <ItemLinha
                key={a.id}
                titulo={a.titulo}
                nivel={a.nivel}
                sub={`${db.videos.filter((v) => v.aulaId === a.id).length} vídeo(s) · ${db.questoes.filter((q) => q.aulaId === a.id).length} questão(ões)`}
                onSubir={podeMover(i, "cima") ? () => mover(i, "cima") : null}
                onDescer={podeMover(i, "baixo") ? () => mover(i, "baixo") : null}
                onAbrir={() => abrir(a)}
                onEditar={() => setForm(a.id)}
                onExcluir={async () => {
                  if (confirm(`Excluir a aula "${a.titulo}"?`))
                    setDb(await deleteAula(a.id));
                }}
              />
            )
          )}
        </ul>
      )}
    </Secao>
  );
}

function AulaForm({ inicial, onSalvar, onCancelar }) {
  const [titulo, setTitulo] = useState(inicial?.titulo || "");
  const [resumo, setResumo] = useState(inicial?.resumo || "");
  const [nivel, setNivel] = useState(inicial?.nivel ?? 3);
  return (
    <FormCard
      onSubmit={() => titulo.trim() && onSalvar({ titulo, resumo, nivel })}
      onCancelar={onCancelar}
    >
      <Campo label="Título da aula">
        <input
          autoFocus
          className={inputClass()}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex.: Função do 1º grau"
        />
      </Campo>
      <NivelPicker value={nivel} onChange={setNivel} />
      <Campo label="Resumo (opcional)">
        <textarea
          className={inputClass()}
          rows={3}
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
          placeholder="Resumo objetivo do conteúdo da aula"
        />
      </Campo>
    </FormCard>
  );
}

// Seletor de incidência (1 a 5 bolinhas vermelhas).
function NivelPicker({ value, onChange }) {
  return (
    <div>
      <span className="text-sm font-semibold text-slate-700">
        Incidência{" "}
        <span className="font-normal text-slate-400">(o quanto cai na prova)</span>
      </span>
      <div className="mt-2 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            aria-label={`Nível ${i}`}
            className={`h-6 w-6 rounded-full transition ${
              i <= value ? "bg-red-500" : "bg-slate-200 hover:bg-slate-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-slate-500">{value}/5</span>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* Detalhe da aula: vídeos + questionário                              */
/* ==================================================================== */
function AulaDetalhe({ db, aula, setDb }) {
  const videos = db.videos.filter((v) => v.aulaId === aula.id);
  const questoes = db.questoes.filter((q) => q.aulaId === aula.id);
  const [addVid, setAddVid] = useState(false);
  const [addQ, setAddQ] = useState(false);

  return (
    <div className="space-y-8">
      {aula.resumo && (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          {aula.resumo}
        </p>
      )}

      {/* Vídeos */}
      <Secao
        titulo="Vídeos do YouTube"
        acao={
          !addVid && <Botao onClick={() => setAddVid(true)}>+ Adicionar vídeo</Botao>
        }
      >
        {addVid && (
          <VideoForm
            onSalvar={async (dados) => {
              setDb(await addVideo(aula.id, dados));
              setAddVid(false);
            }}
            onCancelar={() => setAddVid(false)}
          />
        )}
        {videos.length === 0 && !addVid ? (
          <CardVazio>Cole o link de um vídeo do YouTube para começar.</CardVazio>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {videos.map((v) => (
              <div key={v.id} className="card overflow-hidden">
                <div className="aspect-video bg-slate-100">
                  {v.youtubeId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                      alt={v.titulo}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-red-400">
                      ID de vídeo inválido
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {v.titulo}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {v.youtubeId || "—"}
                    </p>
                  </div>
                  <Botao
                    variant="danger"
                    onClick={async () => setDb(await deleteVideo(v.id))}
                  >
                    Excluir
                  </Botao>
                </div>
              </div>
            ))}
          </div>
        )}
      </Secao>

      {/* Questionário */}
      <Secao
        titulo="Questionário"
        acao={!addQ && <Botao onClick={() => setAddQ(true)}>+ Nova questão</Botao>}
      >
        {addQ && (
          <QuestaoForm
            onSalvar={async (dados) => {
              setDb(await addQuestao(aula.id, dados));
              setAddQ(false);
            }}
            onCancelar={() => setAddQ(false)}
          />
        )}
        {questoes.length === 0 && !addQ ? (
          <CardVazio>Nenhuma questão neste questionário ainda.</CardVazio>
        ) : (
          <ol className="space-y-3">
            {questoes.map((q, i) => (
              <li key={q.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {i + 1}. {q.enunciado || (q.formato === "html" ? "Questão (HTML)" : "")}
                  </p>
                  <Botao
                    variant="danger"
                    onClick={async () => setDb(await deleteQuestao(q.id))}
                  >
                    Excluir
                  </Botao>
                </div>

                {q.formato === "html" ? (
                  <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                    <HtmlEmbed html={q.html} />
                  </div>
                ) : (
                  <ul className="mt-3 space-y-1.5">
                    {q.alternativas.map((alt, idx) =>
                      alt ? (
                        <li
                          key={idx}
                          className={`flex gap-2 text-sm ${
                            idx === q.correta
                              ? "font-semibold text-green-700"
                              : "text-slate-600"
                          }`}
                        >
                          <span>{LETRAS[idx]})</span>
                          <span>{alt}</span>
                          {idx === q.correta && <span>✓</span>}
                        </li>
                      ) : null
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </Secao>
    </div>
  );
}

function VideoForm({ onSalvar, onCancelar }) {
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const id = parseYouTubeId(url);
  const valido = titulo.trim() && id;
  return (
    <FormCard
      onSubmit={() => valido && onSalvar({ titulo, url })}
      onCancelar={onCancelar}
    >
      <Campo label="Título do vídeo">
        <input
          autoFocus
          className={inputClass()}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex.: Introdução às funções"
        />
      </Campo>
      <Campo label="Link ou ID do vídeo do YouTube">
        <input
          className={inputClass()}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </Campo>
      {url && (
        <p className={`text-xs ${id ? "text-green-600" : "text-red-500"}`}>
          {id ? `Vídeo reconhecido: ${id}` : "Não foi possível ler o ID do vídeo."}
        </p>
      )}
    </FormCard>
  );
}

function QuestaoForm({ onSalvar, onCancelar }) {
  const [formato, setFormato] = useState("html"); // padrão: colar HTML
  // modo HTML
  const [titulo, setTitulo] = useState("");
  const [html, setHtml] = useState("");
  // modo formulário
  const [enunciado, setEnunciado] = useState("");
  const [alternativas, setAlternativas] = useState(["", "", "", "", ""]);
  const [correta, setCorreta] = useState(0);

  const preenchidas = alternativas.filter((a) => a.trim()).length;
  const validoForm =
    enunciado.trim() && preenchidas >= 2 && alternativas[correta].trim();
  const validoHtml = html.trim().length > 0;
  const valido = formato === "html" ? validoHtml : validoForm;

  function salvar() {
    if (!valido) return;
    if (formato === "html") {
      onSalvar({ formato: "html", html, enunciado: titulo, alternativas: [], correta: 0 });
    } else {
      onSalvar({ formato: "form", html: null, enunciado, alternativas, correta });
    }
  }

  return (
    <FormCard onSubmit={salvar} onCancelar={onCancelar}>
      {/* Seletor de modo */}
      <div className="flex gap-2">
        {[
          ["html", "Colar HTML"],
          ["form", "Formulário"],
        ].map(([val, label]) => (
          <button
            key={val}
            type="button"
            onClick={() => setFormato(val)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              formato === val
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {formato === "html" ? (
        <>
          <Campo label="Identificação (opcional)">
            <input
              className={inputClass()}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Questão 1 (ENEM 2022)"
            />
          </Campo>
          <Campo label="Código HTML da questão">
            <textarea
              autoFocus
              className={`${inputClass()} font-mono text-xs`}
              rows={8}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="<div>...cole aqui o HTML da questão (enunciado, alternativas e correção)...</div>"
            />
          </Campo>
          {html.trim() && (
            <div>
              <span className="text-sm font-semibold text-slate-700">Prévia</span>
              <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
                <HtmlEmbed html={html} />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <Campo label="Enunciado">
            <textarea
              autoFocus
              className={inputClass()}
              rows={3}
              value={enunciado}
              onChange={(e) => setEnunciado(e.target.value)}
              placeholder="Escreva o enunciado da questão"
            />
          </Campo>
          <div>
            <span className="text-sm font-semibold text-slate-700">
              Alternativas{" "}
              <span className="font-normal text-slate-400">(marque a correta)</span>
            </span>
            <div className="mt-2 space-y-2">
              {alternativas.map((alt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correta"
                    checked={correta === idx}
                    onChange={() => setCorreta(idx)}
                    className="h-4 w-4 accent-green-600"
                  />
                  <span className="w-5 text-sm font-semibold text-slate-500">
                    {LETRAS[idx]}
                  </span>
                  <input
                    className={inputClass()}
                    value={alt}
                    onChange={(e) => {
                      const arr = [...alternativas];
                      arr[idx] = e.target.value;
                      setAlternativas(arr);
                    }}
                    placeholder={`Alternativa ${LETRAS[idx]}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </FormCard>
  );
}

/* ==================================================================== */
/* Peças compartilhadas                                                 */
/* ==================================================================== */
function Secao({ titulo, acao, children }) {
  return (
    <section className="mb-2">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{titulo}</h2>
        {acao}
      </div>
      {children}
    </section>
  );
}

function ItemLinha({ titulo, tag, sub, nivel, onSubir, onDescer, onAbrir, onEditar, onExcluir }) {
  const temReorder = onSubir !== undefined || onDescer !== undefined;
  return (
    <li className="card flex items-center justify-between gap-3 p-4">
      {temReorder && (
        <div className="flex shrink-0 flex-col">
          <button
            onClick={onSubir || undefined}
            disabled={!onSubir}
            title="Mover para cima (mesmo nível)"
            className="text-slate-400 transition hover:text-brand-600 disabled:opacity-30"
          >
            ▲
          </button>
          <button
            onClick={onDescer || undefined}
            disabled={!onDescer}
            title="Mover para baixo (mesmo nível)"
            className="text-slate-400 transition hover:text-brand-600 disabled:opacity-30"
          >
            ▼
          </button>
        </div>
      )}
      <button onClick={onAbrir} className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-slate-900">{titulo}</span>
          {tag && <Tag>{tag}</Tag>}
          {nivel != null && <NivelDots nivel={nivel} />}
        </div>
        {sub && <p className="mt-0.5 truncate text-xs text-slate-500">{sub}</p>}
      </button>
      <div className="flex shrink-0 items-center gap-1">
        <Botao variant="outline" onClick={onAbrir}>
          Abrir →
        </Botao>
        <Botao variant="ghost" onClick={onEditar}>
          Editar
        </Botao>
        <Botao variant="danger" onClick={onExcluir}>
          Excluir
        </Botao>
      </div>
    </li>
  );
}

function FormCard({ children, onSubmit, onCancelar }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="card mb-3 space-y-4 border-brand-200 p-5"
    >
      {children}
      <div className="flex justify-end gap-2">
        <Botao type="button" variant="ghost" onClick={onCancelar}>
          Cancelar
        </Botao>
        <Botao type="submit">Salvar</Botao>
      </div>
    </form>
  );
}
