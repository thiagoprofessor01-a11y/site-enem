"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/modules/admin/admin-store";

// Envia um arquivo (PDF ou, se permitido, imagem) e devolve { url, path, tipo }.
//  tipo = "pdf" | "imagem".
//  • Supabase configurado → sobe para o Storage (bucket "pdfs") → URL pública.
//  • Sem Supabase (local/preview) → devolve como data URL (base64) para testar.
export async function uploadArquivo(file, pasta = "geral", aceitaImagem = false) {
  if (!file) throw new Error("Nenhum arquivo selecionado.");
  const ehPdf = file.type === "application/pdf";
  const ehImagem = file.type.startsWith("image/");
  if (!ehPdf && !(aceitaImagem && ehImagem)) {
    throw new Error(aceitaImagem ? "Envie um PDF ou uma imagem." : "Envie um arquivo PDF.");
  }
  const tipo = ehImagem ? "imagem" : "pdf";

  if (!isSupabaseConfigured()) {
    const dataUrl = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    return { url: dataUrl, path: "", tipo };
  }

  const supabase = createClient();
  const nomeLimpo = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${pasta}/${Date.now()}-${nomeLimpo}`;
  const { error } = await supabase.storage
    .from("pdfs")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("pdfs").getPublicUrl(path);
  return { url: data.publicUrl, path, tipo };
}
