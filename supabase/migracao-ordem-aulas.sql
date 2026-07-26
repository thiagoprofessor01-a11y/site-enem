-- Migração: ordem manual das aulas dentro do módulo.
-- Rode uma vez no SQL Editor do Supabase.
alter table public.aulas add column if not exists ordem integer not null default 0;

-- Inicializa a ordem seguindo a data de criação, dentro de cada módulo.
with r as (
  select id, row_number() over (partition by modulo_id order by created_at) as rn
  from public.aulas
)
update public.aulas a set ordem = r.rn from r where a.id = r.id;
