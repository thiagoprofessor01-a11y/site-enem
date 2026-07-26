-- =====================================================================
-- Passo 1 da segurança — LOGIN DE VERDADE (Supabase Auth)
-- =====================================================================
-- COMO USAR:
--   1. No Supabase, abra "SQL Editor".
--   2. Cole este arquivo INTEIRO e clique em "Run".
--
-- O que ele faz:
--   • Cria a tabela "profiles" (1 linha por usuário) com: papel (role) e
--     se já pagou (pago). É aqui que dizemos quem é admin e quem tem acesso.
--   • Cria um gatilho que, toda vez que alguém se cadastra, cria o profile
--     automaticamente (role = 'aluno', pago = false por padrão).
--   • Liga o RLS: cada um só lê/edita o próprio profile; ninguém vira admin
--     ou marca "pago = true" sozinho pelo navegador.
-- =====================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '',
  role text not null default 'aluno',        -- 'aluno' ou 'admin'
  pago boolean not null default false,        -- liberado só após pagamento
  nascimento date,                            -- data de nascimento (LGPD/menores)
  consentimento_responsavel boolean not null default false, -- consentimento dos pais
  created_at timestamptz not null default now()
);

-- Cria o profile automaticamente quando um usuário novo se cadastra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Segurança (RLS) da tabela profiles
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Cada usuário LÊ o próprio profile.
drop policy if exists "ler o próprio profile" on public.profiles;
create policy "ler o próprio profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Cada usuário ATUALIZA o próprio profile, MAS sem poder mudar role/pago.
-- (Quem promove a admin ou marca 'pago' é você no painel, ou o webhook do
--  pagamento — nunca o próprio usuário.)
drop policy if exists "atualizar dados básicos do próprio profile" on public.profiles;
create policy "atualizar dados básicos do próprio profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Função utilitária: o usuário logado é admin? (usada pelas outras tabelas)
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =====================================================================
-- DEPOIS de criar sua conta admin (ver instruções), rode ISTO trocando
-- o e-mail pelo seu, para virar administrador:
--
--   update public.profiles
--   set role = 'admin', pago = true
--   where id = (select id from auth.users where email = 'SEU-EMAIL-AQUI');
-- =====================================================================
