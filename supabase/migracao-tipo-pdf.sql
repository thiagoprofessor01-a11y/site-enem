-- Migração: adiciona a coluna "tipo" (pdf/imagem) aos bancos de PDF.
-- Rode se você já tinha criado as tabelas com o novas-abas.sql antigo.
alter table public.redacao_pdfs add column if not exists tipo text not null default 'pdf';
alter table public.resumo_pdfs  add column if not exists tipo text not null default 'pdf';
