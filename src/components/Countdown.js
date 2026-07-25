"use client";

import { useEffect, useState } from "react";

function calcDias(dataAlvo) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(dataAlvo + "T00:00:00");
  const diff = Math.ceil((alvo - hoje) / (1000 * 60 * 60 * 24));
  return diff;
}

/**
 * Contagem regressiva até a data do ENEM.
 * Renderiza um destaque grande — o número que mais importa para o estudante.
 */
export default function Countdown({ dataEnem }) {
  // Evita divergência de hidratação: só calcula no cliente.
  const [dias, setDias] = useState(null);

  useEffect(() => {
    setDias(calcDias(dataEnem));
  }, [dataEnem]);

  const dataFormatada = new Date(dataEnem + "T00:00:00").toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "long", year: "numeric" }
  );

  return (
    <div className="card mx-auto flex max-w-md flex-col items-center px-8 py-8 text-center">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
        Contagem regressiva
      </span>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-6xl font-extrabold tabular-nums text-slate-900 sm:text-7xl">
          {dias === null ? "—" : dias > 0 ? dias : 0}
        </span>
        <span className="text-lg font-semibold text-slate-500">dias</span>
      </div>
      <p className="mt-2 text-sm text-slate-500">
        até o ENEM &middot; {dataFormatada}
      </p>
    </div>
  );
}
