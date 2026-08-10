-- =====================================================================
-- SEGURANÇA P0 — Paywall no BANCO (não só na tela)
-- =====================================================================
-- PROBLEMA que isto corrige:
--   Hoje o conteúdo (matérias, aulas, vídeos, questões, etc.) é lido pelo
--   navegador com a chave pública do Supabase, e a política de leitura está
--   "using (true)" — ou seja, QUALQUER pessoa (mesmo sem pagar) consegue
--   puxar todo o conteúdo pela API, mesmo com o site bloqueando na tela.
--
-- O que este script faz:
--   • Cria a função pode_ver_conteudo(): true se o usuário logado já pagou
--     (profiles.pago) OU é admin.
--   • Nas tabelas de CONTEÚDO, troca a leitura aberta por "só assinante/admin".
--   • Mantém a escrita só para admin (is_admin()).
--   • NÃO mexe nas tabelas de dados do usuário (profiles, cronograma, respostas,
--     redações do aluno) — essas continuam com as regras por usuário.
--
-- COMO USAR:
--   1. Rode ANTES o auth-setup.sql (cria is_admin()) — provavelmente já rodou.
--   2. Supabase → SQL Editor → cole este arquivo INTEIRO → Run.
--
-- DEPOIS DE RODAR, TESTE:
--   • Conta que PAGOU → continua vendo aula, vídeo e questão. ✅
--   • Conta sem pagar → não recebe conteúdo (nem pela API). ✅
--   • Admin → continua criando/editando conteúdo. ✅
-- =====================================================================

-- Função: o usuário logado pode ver o conteúdo pago?
create or replace function public.pode_ver_conteudo()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and (pago = true or role = 'admin')
  );
$$;

grant execute on function public.pode_ver_conteudo() to anon, authenticated;

-- Aplica a trava em cada tabela de CONTEÚDO.
do $$
declare
  t text;
  p record;
begin
  foreach t in array array[
    -- conteúdo principal
    'materias','modulos','aulas','aula_videos','questoes',
    -- bancos de questões / redação / simulados / resumos (gerações do schema)
    'q_modulos','q_questoes',
    'r_modulos','r_itens',
    'sim_modulos','sim_itens',
    'resumo_modulos','resumo_pdfs',
    'redacao_pdfs','temas_redacao',
    -- legados
    'conteudo_videos','topicos'
  ]
  loop
    -- pula tabelas que não existem neste banco
    if to_regclass('public.' || t) is null then
      continue;
    end if;

    execute format('alter table public.%I enable row level security;', t);

    -- remove TODAS as policies atuais da tabela (inclui as de leitura aberta,
    -- de qualquer nome/geração), para não sobrar nenhuma brecha.
    for p in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy if exists %I on public.%I;', p.policyname, t);
    end loop;

    -- LEITURA: só quem pagou ou é admin.
    execute format(
      'create policy "conteudo: ler (assinante ou admin)" on public.%I
         for select using (public.pode_ver_conteudo());', t
    );

    -- ESCRITA (inserir/editar/apagar): só admin.
    execute format(
      'create policy "conteudo: escrever (admin)" on public.%I
         for all using (public.is_admin()) with check (public.is_admin());', t
    );
  end loop;
end $$;
