-- Migração: banner (imagem) por matéria.
-- Rode uma vez no SQL Editor do Supabase.
alter table public.materias add column if not exists banner text;
