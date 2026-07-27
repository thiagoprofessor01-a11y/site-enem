import { createClient } from "@supabase/supabase-js";

// Cliente Supabase com a chave service_role — passa por cima do RLS.
// USO EXCLUSIVO NO SERVIDOR (webhooks/rotas de API). NUNCA no cliente.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
