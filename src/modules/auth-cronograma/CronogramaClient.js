"use client";

import { useEffect, useState } from "react";
import { DEFAULT_ENEM_DATE } from "@/lib/config";
import {
  DIAS_SEMANA,
  PESOS_AREA,
  carregarCronograma,
  salvarCronograma,
  apagarCronograma,
  criarCronograma,
  diasCorridos,
  diasDeEstudo,
  formatarData,
  hojeISO,
} from "./cronograma-storage";

export default function CronogramaClient() {
  const [carregado, setCarregado] = useState(false);
  const [cronograma, setCronograma] = useState(null);

  useEffect(() => {
    setCronograma(carregarCronograma());
    setCarregado(true);
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

  // Evita divergência de hidratação enquanto lê o localStorage.
  if (!carregado) {
    return (
      <div className="container py-16 text-center text-slate-400">
        Carregando…
      </div>
    );
  }

  return cronograma ? (
    <ResumoCronograma cronograma={cronograma} onApagar={handleApagar} />
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
          Escolha quanto tempo você vai dedicar por dia. Nós calculamos quantos
          dias faltam para o ENEM e quantas horas de estudo isso representa.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (podeSalvar) onCriar({ horasPorDia, diasSemana, dataEnem });
        }}
        className="card mt-8 space-y-7 p-6 sm:p-8"
      >
        {/* Horas por dia */}
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

        {/* Dias da semana */}
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

        {/* Data do ENEM */}
        <div>
          <label
            htmlFor="dataEnem"
            className="block text-sm font-semibold text-slate-900"
          >
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

        {/* Prévia */}
        <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center">
          <Previa valor={diasAte} rotulo="dias até o ENEM" />
          <Previa valor={diasEstudo} rotulo="dias de estudo" />
          <Previa valor={`${totalHoras}h`} rotulo="total de horas" />
        </div>

        <button type="submit" disabled={!podeSalvar} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
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
/* Resumo do cronograma criado                                        */
/* ------------------------------------------------------------------ */
function ResumoCronograma({ cronograma, onApagar }) {
  const [confirmando, setConfirmando] = useState(false);
  const hoje = hojeISO();

  const diasAgora = diasCorridos(hoje, cronograma.dataEnem);
  const diasEstudoRestantes = diasDeEstudo(
    hoje,
    cronograma.dataEnem,
    cronograma.diasSemana
  );
  const horasRestantes = diasEstudoRestantes * cronograma.horasPorDia;

  const nomesDias = cronograma.diasSemana
    .map((idx) => DIAS_SEMANA[idx].curto)
    .join(" · ");

  const somaPesos = PESOS_AREA.reduce((s, a) => s + a.peso, 0);

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

      {/* Destaque: dias que faltam agora */}
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

      {/* Distribuição sugerida por área */}
      <div className="card mt-8 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Distribuição sugerida do tempo
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Suas {horasRestantes}h divididas por área, com peso proporcional à
          importância na prova.
        </p>
        <div className="mt-5 space-y-4">
          {PESOS_AREA.map((a) => {
            const horas = Math.round((horasRestantes * a.peso) / somaPesos);
            const pct = Math.round((a.peso / somaPesos) * 100);
            return (
              <div key={a.nome}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{a.nome}</span>
                  <span className="tabular-nums text-slate-500">
                    ~{horas}h
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
              <button
                onClick={() => setConfirmando(false)}
                className="btn-secondary"
              >
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

function Metrica({ valor, rotulo }) {
  return (
    <div className="card p-5 text-center">
      <p className="text-2xl font-bold tabular-nums text-slate-900">{valor}</p>
      <p className="mt-1 text-xs text-slate-500">{rotulo}</p>
    </div>
  );
}
