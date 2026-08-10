-- =============================================================
-- Kiwify: liberar/revogar acesso pelo e-mail da compra
-- Rode este SQL UMA VEZ no Supabase:
--   Dashboard → SQL Editor → cole tudo → Run
-- =============================================================

-- Função que recebe o e-mail da compra e marca profiles.pago.
-- security definer: roda com permissão para ler auth.users e atualizar profiles.
create or replace function public.liberar_acesso_por_email(p_email text, p_pago boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set pago = p_pago
  where id = (
    select id from auth.users
    where lower(email) = lower(trim(p_email))
    limit 1
  );
end;
$$;

-- Permite que o webhook (chave service_role) chame a função.
grant execute on function public.liberar_acesso_por_email(text, boolean) to service_role;
