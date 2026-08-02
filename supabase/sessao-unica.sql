-- =====================================================================
-- Uma conta = um dispositivo por vez (anti-compartilhamento)
-- =====================================================================
-- Rode no SQL Editor do Supabase (depois do auth-setup.sql).

-- Guarda o "token do dispositivo ativo" de cada usuário.
alter table public.profiles add column if not exists sessao_atual text;

-- Função que marca ESTE dispositivo como o ativo (só para o próprio usuário).
create or replace function public.registrar_sessao(p_token text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles set sessao_atual = p_token where id = auth.uid();
$$;

grant execute on function public.registrar_sessao(text) to authenticated;
