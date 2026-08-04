"use client";

import { useState } from "react";

// Mostra a foto do aluno aprovado. Se o arquivo não existir (ou o caminho
// estiver errado), cai automaticamente no espaço reservado — sem "imagem
// quebrada" na tela.
export default function FotoAprovado({ foto, nome, resultado }) {
  const [erro, setErro] = useState(false);

  if (foto && !erro) {
    return (
      <img
        src={foto}
        alt={`Foto de ${nome}, ${resultado}`}
        className="h-full w-full object-cover"
        onError={() => setErro(true)}
      />
    );
  }

  return (
    <div className="text-center text-brand-700/70">
      <svg viewBox="0 0 24 24" className="mx-auto h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" strokeLinecap="round" />
      </svg>
      <span className="mt-1 block text-xs font-semibold">Foto do aluno aprovado</span>
    </div>
  );
}
