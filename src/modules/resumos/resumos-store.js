"use client";

// Resumos: módulos (matérias) → PDFs dentro de cada matéria.
import { makePdfStore } from "@/modules/pdfs/pdf-store-factory";

export const resumosStore = makePdfStore({
  key: "meuenem:resumos",
  tabelaModulos: "resumo_modulos",
  tabelaPdfs: "resumo_pdfs",
});
