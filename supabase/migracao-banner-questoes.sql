-- Banner separado para a aba Questões (o "banner" continua sendo o de Conteúdos).
alter table public.materias add column if not exists banner_questoes text;
