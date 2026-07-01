# Cuidados Pela Vida — Visita Médica Digital (MVP)

App de **visita médica digital** para o Hackathon 2026 (Time 5). O herói do
produto é um **Representante Digital (IA)** (Claude): o médico tira dúvidas
clínicas e de produto na hora, e a "visita" acontece de forma natural — a IA
traz conteúdo científico e amostras relacionados quando é clinicamente
pertinente. Ao redor disso há uma camada de engajamento (score, ranking anônimo,
quiz e solicitação de amostras).

> 📄 Contexto e decisões de produto: [`docs/visao-projeto.md`](docs/visao-projeto.md).
> Material de origem (chat do grupo e protótipo HTML): [`docs/referencia/`](docs/referencia/).

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** (paleta da marca)
- **React Router** para navegação
- **localStorage** para persistência (sem backend)
- **Claude API** (opcional) para as sugestões de IA, com fallback mock offline

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (ex.: http://localhost:5173).

> Na tela de login, use **"Entrar com perfil demo"** para pular direto para o app
> como Dr. Pedro Sanches (Cardiologia).

### Build de produção

```bash
npm run build      # type-check + build (saída em dist/)
npm run preview    # serve o build localmente
```

## Deploy

O app é 100% estático (SPA). Para publicar:

```bash
npm run build      # gera dist/
```

Suba a pasta `dist/` em qualquer host estático. Como usa rotas de cliente
(`/amostras`, `/quiz`), o host precisa redirecionar todas as rotas para
`index.html` — já deixamos isso configurado:

- **Vercel:** [`vercel.json`](vercel.json) (rewrites). Basta importar o repo.
- **Netlify:** [`public/_redirects`](public/_redirects). Build: `npm run build`, publish: `dist`.
- **Outros (Nginx/etc.):** aponte o fallback `try_files` para `/index.html`.

> Se for ativar a IA em produção, configure `VITE_ANTHROPIC_API_KEY` nas
> variáveis de ambiente do host. Idealmente, mova a chamada da IA para uma
> serverless function para não expor a chave (ver nota de segurança abaixo).

## IA (opcional)

O app funciona 100% offline com um mecanismo de sugestão mock. Para ativar a IA
real (Claude):

1. Copie `.env.example` para `.env`
2. Preencha `VITE_ANTHROPIC_API_KEY` com sua chave da Anthropic
3. Reinicie o `npm run dev`

Sem chave, o cartão do assistente mostra "sugestão"; com chave, mostra "IA" e a
recomendação é gerada em tempo real a partir do perfil do médico.

> ⚠️ **Nota de segurança:** neste MVP a chamada à Claude API é feita direto do
> navegador (para simplicidade de demo), o que expõe a chave no cliente. Em
> produção, mover essa chamada para um backend/edge function. Nunca versione a
> `.env` — ela está no `.gitignore`.

## Estrutura

```
src/
  main.tsx / App.tsx        # bootstrap + rotas
  types.ts                  # tipos de domínio
  data/mockData.ts          # médicos, conteúdos, amostras, quiz, ranking
  lib/
    storage.ts              # helpers de localStorage
    ai.ts                   # assistente (Q&A) + sugestão via Claude + fallback mock
  context/AppContext.tsx    # estado global (perfil, score, eventos, check-in)
  components/                # AppShell, TopBar, Drawer, ScoreSheet, layout, ícones
  features/
    auth/                   # login / perfil (mock por CRM)
    assistant/              # assistente clínico (chat de Q&A com IA) — herói
    home/                   # Home, AssistantHero, ScoreCard, DailyActions
    content/                # detalhe de conteúdo (credita pontos)
    samples/                # amostras com carrinho e limite
    quiz/                   # caso clínico / quiz
```

## Funcionalidades do MVP

- **Representante Digital (herói):** chat de Q&A com Claude focado em dúvidas
  de medicamentos/tratamentos, personalizado pela especialidade do médico
  logado. Quando a conversa cita um medicamento do catálogo, o link da
  amostra correspondente aparece automaticamente. Fallback mock offline
  quando não há chave de IA.
- **Login por papel** (médico ou representante), persistido localmente
- **Cadência semanal rica:** o card de destaque na Home muda de formato por
  dia — seg: "visita inteligente" com 3 escolhas (amostras/conteúdo/eventos)
  e mini-fluxo de solicitação inline; ter: card de conteúdo científico; qua:
  3 perguntas rápidas sobre a rotina clínica (credita pontos 1x/semana);
  qui: quiz da semana; sex: card de "seguir" + resumo da semana; sáb: grid
  de conteúdo e evento exclusivos; dom: dia de descanso
- **Painel do representante:** carteira de médicos com engajamento, intenção
  (Alto/Médio/Baixo), canal sugerido e ação "Preparar ação" — fecha o loop
  comercial (médico ↔ laboratório)
- Home com o assistente em destaque e conteúdo sugerido pela IA por especialidade
- Score dinâmico: barra de progresso, streak e detalhamento em bottom sheet
- Check-in diário interativo (+10 pts/dia) e pontos pela 1ª consulta ao assistente
- Leitura de conteúdo e quiz que creditam pontos (uma vez cada)
- Ranking **anônimo e comparativo** por especialidade/regional (compliance)
- Amostras com carrinho, limite por lote e recomendação por especialidade
- **Responsivo mobile + desktop:** tela cheia com hambúrguer no celular,
  sidebar fixa + trilho lateral no desktop (ver [docs/design-system.md](docs/design-system.md))

## Reset do estado

Todo o progresso fica em `localStorage` (prefixo `cpv:`). Para zerar, use "Sair"
no menu lateral ou limpe o storage do site nas ferramentas do navegador.

---

Hackathon 2026 · Time 5 — Diego, Gilvan, Jefferson, Luan, Thiago e Tiago.
