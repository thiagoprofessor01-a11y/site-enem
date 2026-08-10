-- =====================================================================
-- SEGURANÇA P0 — impedir que o usuário se dê acesso sozinho
-- =====================================================================
-- PROBLEMA:
--   A tabela profiles deixa cada usuário editar a PRÓPRIA linha. O RLS
--   controla QUAL linha, mas não QUAIS colunas — então, em tese, um usuário
--   poderia chamar a API do Supabase e marcar o próprio "pago = true" ou
--   virar "role = admin".
--
-- CORREÇÃO:
--   Tira a permissão de ESCRITA só nas colunas sensíveis (role, pago).
--   O usuário continua podendo editar nome, nascimento e consentimento.
--   Quem muda role/pago passa a ser só: você no painel (owner) ou o webhook
--   do pagamento (service_role) — ambos ignoram esta restrição.
--
-- COMO USAR: Supabase → SQL Editor → cole tudo → Run.
-- =====================================================================

revoke update (role, pago) on public.profiles from anon, authenticated;

-- Defesa extra: um gatilho que barra qualquer tentativa de mudar role/pago
-- vinda de um usuário comum (não-admin), mesmo que uma policy futura escorregue.
create or replace function public.protege_role_pago()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- service_role (webhook) e a role do banco (owner) passam direto.
  if auth.role() = 'service_role' then
    return new;
  end if;
  -- admin pode mudar (ex.: liberar acesso manualmente pelo painel do app).
  if public.is_admin() then
    return new;
  end if;
  -- usuário comum: não pode alterar role nem pago.
  if new.role is distinct from old.role or new.pago is distinct from old.pago then
    raise exception 'Não permitido alterar role/pago.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protege_role_pago on public.profiles;
create trigger trg_protege_role_pago
  before update on public.profiles
  for each row execute function public.protege_role_pago();
