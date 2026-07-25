"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_ENEM_DATE } from "@/lib/config";
import { fetchAll } from "@/modules/admin/admin-store";
import NivelDots from "@/components/NivelDots";
import {
  DIAS_SEMANA,
  carregarCronograma,
  salvarCronograma,
  apagarCronograma,
  criarCronograma,
  diasCorridos,
  diasDeEstudo,
  formatarData,
  hojeISO,
} from "./cronograma-storage";
import { montarPlano } from "./cronograma-engine";

export default function CronogramaClient() {
  const [carregado, setCarregado] = useState(false);
  const [cronograma, setCronograma] = useState(null);
  const [db, setDb] = useState(null); // conteúdo (matérias/aulas) para o plano

  useEffect(() => {
    setCronograma(carregarCronograma());
    setCarregado(true);
    let ativo = true;
    fetchAll()
      .then((d) => ativo && setDb(d))
      .catch(() => ativo && setDb({ materias: [], modulos: [], aulas: [], videos: [], questoes: [] }));
    return () => {
      ativo = false;
    };
  }, []);

  function handleCriar(dados) {
    const novo = criarCronograma(dados);
    salvarCronograma(novo);
    setCronograma(novo);
  }

  function handleApagar() {
    apagarCronograma();
    setCronograma(null);
  }

  if (!carregado) {
    return (
      <div className="container py-16 text-center text-slate-400">Carregando…</div>
    );
  }

  return cronograma ? (
    <ResumoCronograma cronograma={cronograma} db={db} onApagar={handleApagar} />
  ) : (
    <FormularioCronograma onCriar={handleCriar} />
  );
}

/* ------------------------------------------------------------------ */
/* Formulário de criação                                              */
/* ------------------------------------------------------------------ */
function FormularioCronograma({ onCriar }) {
  const [horasPorDia, setHorasPorDia] = useState(3);
  const [diasSemana, setDiasSemana] = useState([1, 2, 3, 4, 5]); // seg-sex
  const [dataEnem, setDataEnem] = useState(DEFAULT_ENEM_DATE);

  const hoje = hojeISO();
  const diasAte = diasCorridos(hoje, dataEnem);
  const diasEstudo = diasDeEstudo(hoje, dataEnem, diasSemana);
  const totalHoras = diasEstudo * Number(horasPorDia || 0);
  const aulasPossiveis = Math.floor((totalHoras * 60) / 80);

  function toggleDia(idx) {
    setDiasSemana((prev) =>
      prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]
    );
  }

  const podeSalvar =
    Number(horasPorDia) > 0 && diasSemana.length > 0 && diasAte > 0;

  return (
    <div className="container max-w-2xl py-14">
      <div className="text-center">
        <span className="flex mx-auto h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
          🗓️
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
          Montar meu cronograma
        </h1>
        <p className="mt-3 text-slate-600">
          Diga quanto tempo você vai dedicar. Montamos um plano de aulas priorizando
          o que mais cai no ENEM.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (podeSalvar) onCriar({ horasPorDia, diasSemana, dataEnem });
        }}
        className="card mt-8 space-y-7 p-6 sm:p-8"
      >
        <div>
          <label className="block text-sm font-semibold text-slate-900">
            Quantas horas por dia você vai estudar?
          </label>
          <div className="mt-3 flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={horasPorDia}
              onChange={(e) => setHorasPorDia(e.target.value)}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600"
            />
            <span className="w-20 text-right text-2xl font-bold tabular-nums text-brand-700">
              {horasPorDia}h
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900">
            Em quais dias da semana?
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {DIAS_SEMANA.map((d) => {
              const ativo = diasSemana.includes(d.idx);
              return (
                <button
                  key={d.idx}
                  type="button"
                  onClick={() => toggleDia(d.idx)}
                  className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                    ativo
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {d.curto}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="dataEnem" className="block text-sm font-semibold text-slate-900">
            Data da prova
          </label>
          <input
            id="dataEnem"
            type="date"
            value={dataEnem}
            min={hoje}
            onChange={(e) => setDataEnem(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-center sm:grid-cols-4">
          <Previa valor={diasAte} rotulo="dias até o ENEM" />
          <Previa valor={diasEstudo} rotulo="dias de estudo" />
          <Previa valor={`${totalHoras}h`} rotulo="total de horas" />
          <Previa valor={`~${aulasPossiveis}`} rotulo="aulas possíveis" />
        </div>

        <button
          type="submit"
          disabled={!podeSalvar}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          Criar cronograma
        </button>
        {diasAte <= 0 && (
          <p className="text-center text-sm text-red-500">
            Escolha uma data de prova no futuro.
          </p>
        )}
      </form>
    </div>
  );
}

function Previa({ valor, rotulo }) {
  return (
    <div>
      <p className="text-xl font-bold tabular-nums text-slate-900">{valor}</p>
      <p className="mt-0.5 text-xs text-slate-500">{rotulo}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Resumo + plano de aulas                                            */
/* ------------------------------------------------------------------ */
function ResumoCronograma({ cronograma, db, onApagar }) {
  const [confirmando, setConfirmando] = useState(false);
  const hoje = hojeISO();

  const diasAgora = diasCorridos(hoje, cronograma.dataEnem);
  const diasEstudoRestantes = diasDeEstudo(hoje, cronograma.dataEnem, cronograma.diasSemana);
  const horasRestantes = diasEstudoRestantes * cronograma.horasPorDia;
  const nomesDias = cronograma.diasSemana.map((idx) => DIAS_SEMANA[idx].curto).join(" · ");

  const plano = db ? montarPlano(cronograma, db) : null;

  return (
    <div className="container max-w-3xl py-14">
      <div className="text-center">
        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
          Cronograma ativo
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Seu plano de estudos
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Criado em {formatarData(cronograma.dataCriacao)} — quando faltavam{" "}
          <strong>{cronograma.diasNaCriacao} dias</strong> para o ENEM.
        </p>
      </div>

      {/* Faltam agora */}
      <div className="card mt-8 flex flex-col items-center px-8 py-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Faltam agora
        </span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-6xl font-extrabold tabular-nums text-slate-900">
            {diasAgora}
          </span>
          <span className="text-lg font-semibold text-slate-500">dias</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          para {formatarData(cronograma.dataEnem)}
        </p>
      </div>

      {/* Métricas */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Metrica valor={`${cronograma.horasPorDia}h`} rotulo="por dia de estudo" />
        <Metrica valor={diasEstudoRestantes} rotulo="dias de estudo restantes" />
        <Metrica valor={`${horasRestantes}h`} rotulo="horas de estudo até a prova" />
      </div>
      <p className="mt-4 text-center text-sm text-slate-500">
        Dias de estudo: <strong>{nomesDias}</strong>
      </p>

      {/* Plano de aulas */}
      <PlanoView plano={plano} carregando={!db} />

      {/* Ações */}
      <div className="mt-8 flex flex-col items-center gap-3">
        {confirmando ? (
          <div className="card w-full p-5 text-center">
            <p className="text-sm font-medium text-slate-700">
              Tem certeza? O cronograma atual será apagado.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={onApagar}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Sim, apagar
              </button>
              <button onClick={() => setConfirmando(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="text-sm font-semibold text-red-600 transition hover:text-red-700"
          >
            Apagar cronograma e criar um novo
          </button>
        )}
      </div>
    </div>
  );
}

function PlanoView({ plano, carregando }) {
  if (carregando) {
    return (
      <div className="card mt-8 p-6 text-center text-sm text-slate-400">
        Calculando seu plano de aulas…
      </div>
    );
  }
  if (!plano || plano.totalPlanejadas === 0) {
    return (
      <div className="card mt-8 p-6 text-center text-sm text-slate-500">
        As aulas do plano aparecem aqui assim que houver conteúdo cadastrado.
      </div>
    );
  }

  return (
    <div className="card mt-8 p-6">
      <h2 className="text-lg font-semibold text-slate-900">Seu plano de aulas</h2>
      <p className="mt-1 text-sm text-slate-500">
        {plano.totalHoras}h de estudo ÷ 1h20 por aula. Priorizamos o que mais cai
        (bolinhas vermelhas), dividido pelas 5 áreas.
      </p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tabular-nums text-brand-700">
          {plano.totalPlanejadas}
        </span>
        <span className="text-sm font-medium text-slate-500">
          aulas até o ENEM (de {plano.totalAulas} possíveis no tempo)
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {plano.areas.map((area) => (
          <div key={area.slug} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">{area.nome}</h3>
              <span className="text-sm font-medium text-slate-500">
                ~{area.totalSelecionadas} aulas
              </span>
            </div>

            {area.materias.length === 0 ? (
              <p className="mt-2 text-xs text-slate-400">Sem conteúdo nesta área ainda.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {area.materias.map((mp) => (
                  <details key={mp.materia.id} className="group">
                    <summary className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                      <span className="font-medium text-slate-700">{mp.materia.nome}</span>
                      <span className="text-slate-400">
                        {mp.selecionadas.length} aula(s) ▾
                      </span>
                    </summary>
                    {mp.selecionadas.length > 0 ? (
                      <ol className="mt-1 space-y-1 pl-2">
                        {mp.selecionadas.map((aula, i) => (
                          <li key={aula.id}>
                            <Link
                              href={`/conteudos/${mp.materia.id}/${aula.id}`}
                              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-brand-50"
                            >
                              <span className="w-5 text-right text-xs text-slate-400">
                                {i + 1}.
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-slate-800">
                                  {aula.titulo}
                                </span>
                                <span className="block truncate text-xs text-slate-400">
                                  {aula.modNome}
                                </span>
                              </span>
                              <NivelDots nivel={aula.nivel} />
                            </Link>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="px-2 py-1 text-xs text-slate-400">
                        Sem aulas cadastradas nesta matéria.
                      </p>
                    )}
                  </details>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Metrica({ valor, rotulo }) {
  return (
    <div className="card p-5 text-center">
      <p className="text-2xl font-bold tabular-nums text-slate-900">{valor}</p>
      <p className="mt-1 text-xs text-slate-500">{rotulo}</p>
    </div>
  );
}
