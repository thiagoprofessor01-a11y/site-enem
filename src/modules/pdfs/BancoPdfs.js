"use client";

import { useEffect, useState } from "react";
import PdfCard from "@/components/PdfCard";
import { uploadPdf } from "@/lib/pdf-upload";
import { useSessao } from "@/modules/auth/auth";

// Banco de PDFs. Dois modos:
//  • comModulos=false (Redação): lista simples de PDFs (título + arquivo).
//  • comModulos=true  (Resumos): módulos (matérias) → PDFs dentro de cada uma.
//
// store: { fetchBanco, addModulo, updateModulo, deleteModulo, addPdf, deletePdf }
//   fetchBanco() → { modulos: [], pdfs: [{id, moduloId, titulo, url, path, ordem}] }

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function BancoPdfs({ store, textos, comModulos = false, embutido = false, forcarAdmin = false }) {
  const sessao = useSessao();
  const [banco, setBanco] = useState(null);

  useEffect(() => {
    let ativo = true;
    store
      .fetchBanco()
      .then((d) => ativo && setBanco(d))
      .catch(() => ativo && setBanco({ modulos: [], pdfs: [] }));
    return () => {
      ativo = false;
    };
  }, [store]);

  async function recarregar(promise) {
    const d = await promise;
    setBanco(d);
  }

  if ((!forcarAdmin && sessao === undefined) || banco === null) {
    return <div className="py-16 text-center text-slate-400">Carregando…</div>;
  }

  const admin = forcarAdmin || sessao?.role === "admin";
  const t = textos;
  const pdfsDe = (moduloId) =>
    banco.pdfs
      .filter((p) => (comModulos ? p.moduloId === moduloId : true))
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

  const corpo = comModulos ? (
    <ModoModulos banco={banco} admin={admin} store={store} textos={t} recarregar={recarregar} pdfsDe={pdfsDe} />
  ) : (
    <ModoFlat pdfs={pdfsDe()} admin={admin} store={store} textos={t} recarregar={recarregar} />
  );

  if (embutido) return <div>{corpo}</div>;

  return (
    <div className="container max-w-4xl py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t.titulo}</h1>
        <p className="mx-auto mt-2 max-w-lg text-slate-600">{admin ? t.subtituloAdmin : t.subtitulo}</p>
      </header>
      {corpo}
    </div>
  );
}

/* ---------- modo simples (Redação) ---------- */
function ModoFlat({ pdfs, admin, store, textos, recarregar }) {
  return (
    <div className="space-y-6">
      {admin && (
        <UploadForm
          textos={textos}
          pasta="redacao"
          onSalvar={(dados) => recarregar(store.addPdf(null, dados))}
        />
      )}
      {pdfs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          Nenhum PDF publicado ainda.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((p) => (
            <PdfCard
              key={p.id}
              titulo={p.titulo}
              url={p.url}
              onExcluir={admin ? () => recarregar(store.deletePdf(p.id)) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- modo com módulos (Resumos) ---------- */
function ModoModulos({ banco, admin, store, textos, recarregar, pdfsDe }) {
  const modulos = [...banco.modulos].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  return (
    <div className="space-y-8">
      {admin && <NovoModulo textos={textos} onCriar={(nome) => recarregar(store.addModulo({ nome }))} />}
      {modulos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          Nenhuma matéria cadastrada ainda.
        </div>
      ) : (
        modulos.map((mod) => (
          <ModuloBloco
            key={mod.id}
            modulo={mod}
            pdfs={pdfsDe(mod.id)}
            admin={admin}
            textos={textos}
            onExcluir={() => recarregar(store.deleteModulo(mod.id))}
            onAddPdf={(dados) => recarregar(store.addPdf(mod.id, dados))}
            onDelPdf={(id) => recarregar(store.deletePdf(id))}
          />
        ))
      )}
    </div>
  );
}

function ModuloBloco({ modulo, pdfs, admin, textos, onExcluir, onAddPdf, onDelPdf }) {
  const [addindo, setAddindo] = useState(false);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">{modulo.nome}</h2>
        {admin && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Excluir a matéria "${modulo.nome}" e seus PDFs?`)) onExcluir();
            }}
            className="rounded-md px-2 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50"
          >
            Excluir matéria
          </button>
        )}
      </div>

      {pdfs.length === 0 && !addindo && (
        <p className="text-sm text-slate-400">Nenhum resumo nesta matéria ainda.</p>
      )}

      {pdfs.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((p) => (
            <PdfCard
              key={p.id}
              titulo={p.titulo}
              url={p.url}
              onExcluir={admin ? () => onDelPdf(p.id) : undefined}
            />
          ))}
        </div>
      )}

      {admin &&
        (addindo ? (
          <div className="mt-4">
            <UploadForm
              textos={textos}
              pasta="resumos"
              onSalvar={(dados) => {
                onAddPdf(dados);
                setAddindo(false);
              }}
              onCancelar={() => setAddindo(false)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddindo(true)}
            className="mt-4 w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-400 hover:bg-brand-50"
          >
            + Adicionar PDF
          </button>
        ))}
    </section>
  );
}

function NovoModulo({ textos, onCriar }) {
  const [nome, setNome] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!nome.trim()) return;
        onCriar(nome.trim());
        setNome("");
      }}
      className="flex gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <input
        className={input}
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder={textos.placeholderModulo || "Nome da matéria (ex.: Matemática)"}
      />
      <button
        type="submit"
        disabled={!nome.trim()}
        className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
      >
        + Matéria
      </button>
    </form>
  );
}

function UploadForm({ textos, pasta, onSalvar, onCancelar }) {
  const [titulo, setTitulo] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    if (!titulo.trim() || !arquivo) {
      setErro("Preencha o título e escolha o PDF.");
      return;
    }
    setEnviando(true);
    try {
      const { url, path } = await uploadPdf(arquivo, pasta);
      await onSalvar({ titulo: titulo.trim(), url, path });
      setTitulo("");
      setArquivo(null);
    } catch (err) {
      setErro(err?.message || "Não foi possível enviar o PDF.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={salvar} className="space-y-3 rounded-xl border border-brand-200 bg-brand-50/40 p-4">
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Título</label>
        <input
          className={input}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder={textos.placeholderTitulo || "Ex.: Tema — Meio ambiente"}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Arquivo PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setArquivo(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
        />
      </div>
      {erro && <p className="text-sm font-medium text-rose-600">{erro}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {enviando ? "Enviando…" : "Adicionar PDF"}
        </button>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
