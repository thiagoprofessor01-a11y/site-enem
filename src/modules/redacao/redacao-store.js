"use client";

// Redação: lista simples de PDFs (título + arquivo). Sem módulos.
import { makePdfStore } from "@/modules/pdfs/pdf-store-factory";

export const redacaoStore = makePdfStore({
  key: "meuenem:redacao-pdfs",
  tabelaModulos: null,
  tabelaPdfs: "redacao_pdfs",
});
