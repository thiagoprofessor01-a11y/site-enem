"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso em Client Components (browser).
 *
 * Uso:
 *   import { createClient } from "@/lib/supabase/client";
 *   const supabase = createClient();
 *   const { data } = await supabase.from("materias").select("*");
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
