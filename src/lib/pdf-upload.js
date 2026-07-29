"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/modules/admin/admin-store";

// Envia um PDF e devolve { url, path }.
//  • Supabase configurado → sobe para o Storage (bucket "pdfs") e devolve a URL pública.
//  • Sem Supabase (local/preview) → devolve o PDF como data URL (base64) para testar.
export async function uploadPdf(file, pasta = "geral") {
  if (!file) throw new Error("Nenhum arquivo selecionado.");
  if (file.type !== "application/pdf") throw new Error("Envie um arquivo PDF.");

  if (!isSupabaseConfigured()) {
    const dataUrl = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    return { url: dataUrl, path: "" };
  }

  const supabase = createClient();
  const nomeLimpo = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${pasta}/${Date.now()}-${nomeLimpo}`;
  const { error } = await supabase.storage
    .from("pdfs")
    .upload(path, file, { contentType: "application/pdf", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("pdfs").getPublicUrl(path);
  return { url: data.publicUrl, path };
}
