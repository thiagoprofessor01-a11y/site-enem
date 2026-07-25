# 🚀 Como colocar o site no ar e conectar ao banco de dados

Guia rápido para (1) publicar o site num endereço que você abre no navegador e
(2) ligar o painel `/admin` a um banco de dados real, para o conteúdo que você
cadastrar ficar salvo de verdade.

Você **não precisa instalar nada no seu computador** — dá pra fazer tudo pelo
navegador, usando GitHub + Supabase + Vercel (todos com plano gratuito).

---

## Parte 1 — Criar o banco de dados (Supabase)

1. Acesse <https://supabase.com> e crie uma conta (pode entrar com o GitHub).
2. Clique em **New project**. Dê um nome (ex.: `meuenem`), defina uma senha de
   banco e escolha a região **South America (São Paulo)**. Clique em **Create**.
3. Espere ~1 minuto até o projeto ficar pronto.
4. No menu lateral, abra **SQL Editor** → **New query**.
5. Abra o arquivo [`supabase/admin.sql`](./supabase/admin.sql) deste repositório,
   **copie todo o conteúdo**, cole no editor e clique em **Run**.
   - Isso cria as tabelas de conteúdo (matérias, módulos, aulas, vídeos e
     questões) que o painel `/admin` usa.
6. Ainda no Supabase, vá em **Project Settings** (engrenagem) → **API** e
   **anote** dois valores:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - **anon public** key (uma chave longa)

> Guarde esses dois valores — você vai usá-los na Parte 3.

---

## Parte 2 — Publicar o site (Vercel)

1. Acesse <https://vercel.com> e crie uma conta entrando com o **GitHub**.
2. Clique em **Add New… → Project**.
3. Selecione o repositório **`site-enem`** e clique em **Import**.
   - A Vercel detecta que é um projeto Next.js sozinha — não mude nada.
4. **Antes de clicar em Deploy**, expanda **Environment Variables** e adicione
   as duas variáveis (Parte 1, passo 6):

   | Name (nome)                       | Value (valor)                     |
   |-----------------------------------|-----------------------------------|
   | `NEXT_PUBLIC_SUPABASE_URL`        | sua Project URL do Supabase       |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | sua chave anon public do Supabase |

5. Clique em **Deploy** e aguarde ~1 minuto.
6. A Vercel vai te dar um endereço, tipo `https://site-enem.vercel.app`.
   **Esse é o seu site**, acessível de qualquer navegador. 🎉

---

## Parte 3 — Usar o painel de administração

1. Abra o seu site e vá para **`/admin`** (ex.: `https://site-enem.vercel.app/admin`).
2. No topo do painel deve aparecer o selo verde **"● Conectado ao banco
   (Supabase)"**. Isso confirma que está salvando no banco de dados.
   - Se aparecer o selo âmbar **"Salvando neste navegador"**, as variáveis de
     ambiente não foram lidas — confira a Parte 2, passo 4, e refaça o deploy.
3. Agora é só cadastrar:
   - **Nova matéria** → abra a matéria → **Novo módulo** → abra o módulo →
     **Nova aula** → abra a aula → adicione **vídeos do YouTube** (cole o link)
     e monte o **questionário** (enunciado + alternativas + a correta).
4. Tudo o que você cadastrar fica salvo no Supabase e disponível para o site.

---

## Como cada alteração no código chega ao site

O deploy é automático: sempre que um novo código for enviado para a branch do
projeto no GitHub, a Vercel publica a nova versão sozinha. Você não precisa
fazer nada manualmente.

---

## ⚠️ Importante antes de divulgar o site

Para você começar a cadastrar conteúdo **agora**, o banco está com a escrita
**liberada** (qualquer visitante conseguiria gravar). Isso é seguro enquanto o
site é só seu/da equipe, mas **antes de divulgar publicamente** é preciso
proteger o `/admin` com **login de administrador**. É rápido de fazer — peça
para o time A (login) ou posso implementar quando você quiser.

---

## Rodar no seu próprio computador (opcional)

Se preferir testar localmente antes de publicar:

```bash
npm install
cp .env.example .env.local     # preencha com a URL e a anon key do Supabase
npm run dev                    # abre em http://localhost:3000
```
