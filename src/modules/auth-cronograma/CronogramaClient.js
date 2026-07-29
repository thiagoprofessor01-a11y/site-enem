"use client";

import { useEffect, useState } from "react";
import { DEFAULT_ENEM_DATE } from "@/lib/config";
import { fetchAll } from "@/modules/admin/admin-store";
import {
  DIAS_SEMANA,
  carregarCronograma,
  salvarCronograma,
  apagarCronograma,
  criarCronograma,
  diasCorridos,
  diasDeEstudo,
  hojeISO,
} from "./cronograma-storage";
import { montarAgenda } from "./cronograma-engine";
import AgendaAulas from "@/modules/conteudos-dashboard/AgendaAulas";
import { useConcluidas } from "@/modules/conteudos-dashboard/progresso";

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
    return <div className="container py-16 text-center text-slate-400">Carregando…</div>;
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
  const dataEnem = DEFAULT_ENEM_DATE;

  const hoje = hojeISO();
  const diasAte = diasCorridos(hoje, dataEnem);
  const diasEstudo = diasDeEstudo(hoje, dataEnem, diasSemana);
  const totalHoras = diasEstudo * Number(horasPorDia || 0);
  const aulasPossiveis = totalHoras; // ~1 aula por hora

  function toggleDia(idx) {
    setDiasSemana((prev) =>
      prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]
    );
  }

  const podeSalvar = Number(horasPorDia) > 0 && diasSemana.length > 0 && diasAte > 0;

  return (
    <div className="container max-w-2xl py-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Configurar meu cronograma
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

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-6 text-center sm:grid-cols-4">
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
/* Resumo — em destaque só as aulas do dia                            */
/* ------------------------------------------------------------------ */
function ResumoCronograma({ cronograma, db, onApagar }) {
  const [confirmando, setConfirmando] = useState(false);
  const hoje = hojeISO();
  const diasAgora = diasCorridos(hoje, cronograma.dataEnem);
  const concluidas = useConcluidas();
  const agenda = db ? montarAgenda(cronograma, db, concluidas || []) : null;

  return (
    <div className="container max-w-3xl py-8">
      {/* Cabeçalho + contador pequeno no canto */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
            Cronograma ativo
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Seu plano de hoje
          </h1>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-500"
          title="Dias que faltam para o ENEM"
        >
          🔥 {diasAgora} dias
        </span>
      </div>

      {/* Aulas do dia (destaque) + próximos dias */}
      <AgendaAulas agenda={agenda} hoje={hoje} />

      {/* Ação: refazer/apagar */}
      <div className="mt-10 flex flex-col items-center gap-3">
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
            Refazer meu cronograma
          </button>
        )}
      </div>
    </div>
  );
}
