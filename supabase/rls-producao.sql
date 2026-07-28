-- =====================================================================
-- SEGURANÇA DE PRODUÇÃO — feche a escrita do banco antes de abrir ao público
-- =====================================================================
-- COMO USAR:
--   1. Rode ANTES o auth-setup.sql (cria a função is_admin()).
--   2. No Supabase, abra "SQL Editor", cole este arquivo INTEIRO e clique Run.
--
-- O que muda:
--   • LEITURA continua liberada (o site precisa ler o conteúdo).
--   • ESCRITA (inserir/editar/apagar) passa a ser SÓ de administrador.
--   Isso fecha o buraco atual em que qualquer visitante podia alterar o banco.
-- =====================================================================

do $$
declare t text;
begin
  foreach t in array array[
    'materias','modulos','aulas','aula_videos','questoes',
    'q_modulos','q_questoes','r_modulos','r_itens'
  ]
  loop
    -- garante RLS ligado
    execute format('alter table public.%I enable row level security;', t);

    -- remove a política antiga aberta (escrita liberada para todos)
    execute format('drop policy if exists "acesso liberado (mvp)" on public.%I;', t);

    -- LEITURA: liberada para todos
    execute format('drop policy if exists "leitura publica" on public.%I;', t);
    execute format(
      'create policy "leitura publica" on public.%I for select using (true);', t
    );

    -- ESCRITA: só administrador (usa a função is_admin() do auth-setup.sql)
    execute format('drop policy if exists "escrita admin" on public.%I;', t);
    execute format(
      'create policy "escrita admin" on public.%I for all
         using (public.is_admin()) with check (public.is_admin());', t
    );
  end loop;
end $$;
