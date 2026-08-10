# Segurança do MeuENEM

Resumo da auditoria e das correções. Escrito para ser entendido sem ser programador.

---

## ✅ O que já foi corrigido no código/repositório

1. **Paywall no banco (crítico).** O conteúdo era lido pelo navegador com a chave
   pública do Supabase e a leitura estava liberada para todos — dava para puxar tudo
   sem pagar pela API. Correção: `supabase/seguranca-conteudo-rls.sql` (leitura só
   para quem pagou ou admin; escrita só admin).
2. **Escalada de privilégio no `profiles` (crítico).** O usuário podia, em tese,
   marcar o próprio `pago = true` ou virar `admin` pela API. Correção:
   `supabase/seguranca-profiles.sql` (revoga escrita nas colunas `role`/`pago` +
   gatilho de proteção).
3. **Painel inicial trancado.** Quem está logado mas não pagou não vê mais o painel
   (antes parecia acesso liberado). Agora cai na tela "escolha um plano".
4. **Webhook do Kiwify mais seguro.** Passou a **falhar fechado** (recusa se o token
   não estiver configurado ou a assinatura não bater) e usa comparação em tempo
   constante (anti timing-attack). Arquivo: `src/app/api/kiwify/webhook/route.js`.
5. **Cabeçalhos de segurança** em `next.config.js`: Content-Security-Policy,
   HSTS, X-Frame-Options (anti-clickjacking), X-Content-Type-Options, Referrer-Policy,
   Permissions-Policy, e remoção do header "X-Powered-By".
6. **Chave service_role** confirmada: usada **só no servidor**, nunca no cliente.
7. **Segredos:** nenhum `.env` real versionado; `.gitignore` reforçado; `.env.example`
   atualizado (Kiwify no lugar da Stripe, sem segredos reais).
8. **HtmlEmbed** (HTML de questões) já roda em **iframe isolado sem `allow-same-origin`**,
   então não acessa cookies/sessão do site. OK.

---

## 👉 O que VOCÊ precisa fazer (manual)

### No Supabase (SQL Editor → colar → Run), nesta ordem:
1. `supabase/auth-setup.sql` — se ainda não rodou (cria `is_admin()`).
2. `supabase/seguranca-conteudo-rls.sql` — trava a leitura do conteúdo por pagamento.
3. `supabase/seguranca-profiles.sql` — impede o usuário de se dar acesso sozinho.

**Depois teste:** conta que pagou vê o conteúdo; conta sem pagar não vê; admin edita normalmente.

### No painel do Supabase (Authentication → Providers/Settings):
- **Confirmação de e-mail:** deixe **ligada** (evita cadastro com e-mail de terceiros).
- **Senha mínima:** defina pelo menos 8 caracteres.
- **Rate limit** de login/cadastro: use os limites nativos do Supabase Auth (já existem;
  confira se não estão afrouxados).

### Na Vercel:
- Confirme `KIWIFY_WEBHOOK_TOKEN` setado (o webhook agora recusa sem ele).
- Pode remover `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` (não são mais usados).

### Depois do deploy, TESTE os fluxos (por causa do CSP):
- Login, uma compra de teste no Kiwify, abrir um **vídeo** e uma **questão**, e ver se o
  **Pixel** dispara (Meta Pixel Helper). Se algo não carregar, é o CSP — me avise que ajusto
  a fonte permitida em `next.config.js`.

---

## 🔶 Recomendado (fica de próxima etapa)

- **PDFs no Storage são públicos** (`"pdfs leitura publica"` em `schema.sql`): quem tem o
  link baixa sem pagar. Ideal trocar por **bucket privado + URLs assinadas** geradas no
  servidor só para quem pagou. (Mexe em como os PDFs abrem — dá para eu fazer depois.)
- **Idempotência do webhook**: guardar os IDs de pedido já processados (defesa extra contra
  reenvio). Hoje o efeito é idempotente na prática (marcar pago duas vezes não muda nada).
- **`npm audit`**: revisar/atualizar dependências vulneráveis.
- **Remover código legado da Stripe** (`src/app/api/stripe/*`) — inerte, mas reduz superfície.
- **LGPD**: caminho de exclusão/exportação de dados do aluno; revisar a Política de
  Privacidade; consentimento de menores já é coletado no cadastro.

---

_Última atualização: auditoria inicial de segurança._
