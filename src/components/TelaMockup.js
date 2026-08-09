"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

// Conteúdo da "tela" do computador no hero.
// Se existir o print em public/mockup-plataforma.png, mostra a imagem real.
// Senão (arquivo ausente), cai no painel "Plano de hoje" desenhado.
export default function TelaMockup() {
  const [erro, setErro] = useState(false);

  if (!erro) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/mockup-plataforma.png"
        alt="Plataforma MeuENEM aberta no computador"
        className="block w-full"
        onError={() => setErro(true)}
      />
    );
  }

  return (
    <div className="bg-white p-5 text-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Meu ENEM</span>
        <span className="rounded-full bg-acerto/15 px-2.5 py-1 text-xs font-bold text-acerto">
          Plano de hoje
        </span>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Meta semanal</span>
          <span className="text-brand-600">74%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-brand-600 to-ciano" />
        </div>
      </div>
      <ul className="mt-5 space-y-2.5">
        {[
          ["Redação — revisar repertório", "lapis"],
          ["Matemática — 20 questões", "lista"],
          ["Natureza — simulado curto", "raio"],
        ].map(([txt, ic]) => (
          <li key={txt} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Icon name={ic} className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-slate-800">{txt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
