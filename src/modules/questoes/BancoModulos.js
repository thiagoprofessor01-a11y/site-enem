"use client";

import { useEffect, useState } from "react";
import HtmlEmbed from "@/components/HtmlEmbed";
import { useSessao } from "@/modules/auth/auth";

// Componente genérico de "banco" organizado em módulos → itens (HTML colado).
// Usado tanto pelo Banco de questões quanto pela Redação — a estrutura é a
// mesma (o admin cria módulos e cola o HTML de cada item, igual às aulas).
//
// props.store: { fetchBanco, addModulo, updateModulo, deleteModulo, addItem, deleteItem }
// props.textos: { titulo, subtitulo, subtituloAdmin, placeholderModulo, botaoModulo, botaoItem, itemNome }
// props.embutido: quando true, esconde o cabeçalho grande (uso dentro do /admin)
// props.forcarAdmin: quando true, mostra a edição sem depender da sessão (uso no /admin)

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function BancoModulos({ store, textos, embutido = false, forcarAdmin = false }) {
  const sessao = useSessao();
  const [banco, setBanco] = useState(null);

  useEffect(() => {
    let ativo = true;
    store
      .fetchBanco()
      .then((d) => ativo && setBanco(d))
      .catch(() => ativo && setBanco({ modulos: [], questoes: [] }));
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
  const modulos = [...banco.modulos].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  const itensDo = (moduloId) =>
    banco.questoes
      .filter((q) => q.moduloId === moduloId)
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

  const corpo = (
    <>
      {admin && (
        <NovoModulo
          placeholder={t.placeholderModulo}
          botao={t.botaoModulo}
          onCriar={(nome) => recarregar(store.addModulo({ nome }))}
        />
      )}

      {modulos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          Nenhum módulo cadastrado ainda.
        </div>
      ) : (
        <div className="space-y-8">
          {modulos.map((mod) => (
            <ModuloBloco
              key={mod.id}
              modulo={mod}
              itens={itensDo(mod.id)}
              admin={admin}
              textos={t}
              onRenomear={(nome) => recarregar(store.updateModulo(mod.id, { nome }))}
              onExcluir={() => recarregar(store.deleteModulo(mod.id))}
              onAddItem={(dados) => recarregar(store.addItem(mod.id, dados))}
              onDelItem={(id) => recarregar(store.deleteItem(id))}
            />
          ))}
        </div>
      )}
    </>
  );

  if (embutido) return <div>{corpo}</div>;

  return (
    <div className="container max-w-2xl py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t.titulo}</h1>
        <p className="mx-auto mt-2 max-w-lg text-slate-600">
          {admin ? t.subtituloAdmin : t.subtitulo}
        </p>
      </header>
      {corpo}
    </div>
  );
}

function NovoModulo({ placeholder, botao, onCriar }) {
  const [nome, setNome] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!nome.trim()) return;
        onCriar(nome.trim());
        setNome("");
      }}
      className="mb-8 flex gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <input
        className={input}
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder={placeholder}
      />
      <button
        type="submit"
        disabled={!nome.trim()}
        className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
      >
        {botao}
      </button>
    </form>
  );
}

function ModuloBloco({ modulo, itens, admin, textos, onRenomear, onExcluir, onAddItem, onDelItem }) {
  const [aberto, setAberto] = useState(true);
  const [addindo, setAddindo] = useState(false);
  const [editandoNome, setEditandoNome] = useState(false);
  const [nome, setNome] = useState(modulo.nome);
  const t = textos;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className={`text-slate-400 transition ${aberto ? "rotate-90" : ""}`} aria-hidden>
            ▶
          </span>
          {editandoNome ? (
            <input
              autoFocus
              className={input}
              value={nome}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setNome(e.target.value)}
              onBlur={() => {
                setEditandoNome(false);
                if (nome.trim() && nome.trim() !== modulo.nome) onRenomear(nome.trim());
                else setNome(modulo.nome);
              }}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
          ) : (
            <h2 className="truncate text-lg font-bold text-slate-900">{modulo.nome}</h2>
          )}
          <span className="shrink-0 text-xs font-medium text-slate-400">
            {itens.length} {t.itemNome}(s)
          </span>
        </button>
        {admin && !editandoNome && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setEditandoNome(true)}
              className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200"
            >
              Renomear
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Excluir o módulo "${modulo.nome}" e seus itens?`)) onExcluir();
              }}
              className="rounded-md px-2 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {aberto && (
        <div className="space-y-4 p-4">
          {itens.length === 0 && !addindo && (
            <p className="text-sm text-slate-400">Nenhum item neste módulo ainda.</p>
          )}

          {itens.map((q, i) => (
            <div key={q.id} className="rounded-xl border border-slate-200">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
                <span className="text-sm font-semibold text-slate-700">
                  {i + 1}. {q.titulo || t.itemPadrao}
                </span>
                {admin && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Excluir este item?")) onDelItem(q.id);
                    }}
                    className="rounded-md px-2 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50"
                  >
                    Excluir
                  </button>
                )}
              </div>
              <div className="p-2">
                <HtmlEmbed html={q.html} />
              </div>
            </div>
          ))}

          {admin &&
            (addindo ? (
              <NovoItem
                textos={t}
                onSalvar={(dados) => {
                  onAddItem(dados);
                  setAddindo(false);
                }}
                onCancelar={() => setAddindo(false)}
              />
            ) : (
              <button
                type="button"
                onClick={() => setAddindo(true)}
                className="w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-400 hover:bg-brand-50"
              >
                {t.botaoItem}
              </button>
            ))}
        </div>
      )}
    </section>
  );
}

function NovoItem({ textos, onSalvar, onCancelar }) {
  const [titulo, setTitulo] = useState("");
  const [html, setHtml] = useState("");
  const valido = html.trim().length > 0;
  const t = textos;

  return (
    <div className="space-y-3 rounded-xl border border-brand-200 bg-brand-50/40 p-3">
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Identificação (opcional)
        </label>
        <input
          className={input}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder={t.placeholderTitulo}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">{t.labelHtml}</label>
        <textarea
          autoFocus
          className={`${input} font-mono text-xs`}
          rows={8}
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder={t.placeholderHtml}
        />
      </div>
      {html.trim() && (
        <div>
          <span className="text-sm font-semibold text-slate-700">Prévia</span>
          <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <HtmlEmbed html={html} />
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!valido}
          onClick={() => onSalvar({ titulo, html })}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
