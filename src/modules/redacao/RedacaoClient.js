"use client";

import BancoPdfs from "@/modules/pdfs/BancoPdfs";
import { redacaoStore } from "./redacao-store";

const textos = {
  titulo: "Redação",
  subtitulo: "Os melhores temas para você produzir sua redação.",
  subtituloAdmin: "Adicione PDFs de redação (título + arquivo). O aluno vê a prévia e baixa.",
  placeholderTitulo: "Ex.: Estrutura da dissertação / Tema — Meio ambiente",
};

export default function RedacaoClient({ embutido = false, forcarAdmin = false }) {
  return (
    <BancoPdfs
      store={redacaoStore}
      textos={textos}
      comModulos={false}
      embutido={embutido}
      forcarAdmin={forcarAdmin}
    />
  );
}
