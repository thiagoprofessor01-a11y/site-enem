-- =====================================================================
-- PAGAR ANTES DE CADASTRAR
-- =====================================================================
-- Fluxo novo: a pessoa clica em comprar → paga no Kiwify → só DEPOIS cria a
-- conta. Como o pagamento acontece antes da conta existir, guardamos o e-mail
-- que pagou numa tabela e liberamos o acesso quando a conta for criada.
--
-- Cobre todas as ordens:
--   • pagou e depois cadastrou  → o cadastro herda o acesso
--   • já tinha conta e pagou     → o webhook atualiza o profile na hora
--   • boleto que compensa depois → idem (atualiza o profile já existente)
--
-- COMO USAR: Supabase → SQL Editor → cole tudo → Run.
-- (Rode depois do auth-setup.sql e do seguranca-profiles.sql.)
-- =====================================================================

-- E-mails que pagaram (podem ainda não ter conta).
create table if not exists public.acessos_pagos (
  email text primary key,
  pago boolean not null default true,
  atualizado_em timestamptz not null default now()
);

alter table public.acessos_pagos enable row level security;
-- Sem policies de propósito: só service_role e funções security definer acessam.

-- Libera/revoga por e-mail: registra em acessos_pagos E atualiza o profile
-- (se a conta já existir).
create or replace function public.liberar_acesso_por_email(p_email text, p_pago boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
begin
  insert into public.acessos_pagos (email, pago, atualizado_em)
  values (v_email, p_pago, now())
  on conflict (email) do update
    set pago = excluded.pago, atualizado_em = now();

  update public.profiles
  set pago = p_pago
  where id = (select id from auth.users where lower(email) = v_email limit 1);
end;
$$;

grant execute on function public.liberar_acesso_por_email(text, boolean) to service_role;

-- Ao criar a conta, herda o "pago" de quem já havia pago antes do cadastro.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_pago boolean;
begin
  select pago into v_pago
  from public.acessos_pagos
  where email = lower(new.email)
  limit 1;

  insert into public.profiles (id, nome, pago)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(v_pago, false)
  );
  return new;
end;
$$;
