# Visão do Projeto — Visita Médica Digital

> Cuidados Pela Vida · Hackathon 2026 · Time 5
> Documento de produto (reformulado a partir das anotações do grupo).

## 1. O problema

A visita médica tradicional (representante indo ao consultório) é cara, tem baixa
frequência e alcance limitado. O tema do time é **ampliar o alcance e a
frequência da visitação médica** — sem depender de deslocamento físico.

## 2. A proposta

Uma **plataforma de visita médica digital** cujo núcleo é um **assistente
clínico com IA**. Em vez de exigir que o médico "venha até um portal ganhar
pontos", entregamos algo que ele realmente quer: respostas clínicas e de produto
na hora, com base científica. A visita acontece dentro dessa conversa — a IA traz
conteúdo e amostras do laboratório quando é clinicamente pertinente.

Ao redor do assistente existe uma **camada de engajamento** (score, ranking
anônimo, quiz, amostras por mérito) que sustenta o relacionamento contínuo e
gera, para o laboratório, a inteligência de quais médicos são "high responders".

> **Por que o assistente é o herói (decisão da v2):** o problema mais difícil da
> relação farma–médico não é "qual feature", é **atenção**. Médico ignora visita,
> e-mail e portal. Uma IA útil resolve isso (o médico volta porque agrega valor) e
> **escala a visitação de verdade** — uma IA atende milhares de médicos 24/7, o que
> é literalmente o tema: *ampliar alcance*.

> **Posicionamento (decisão do grupo):** vendemos como **"visita médica
> digital"**, não como "gamificação". A mecânica de pontos existe, mas é
> secundária; o discurso é educação médica e relacionamento contínuo.

## 3. Pilares

| Pilar | O que é | Por quê |
|---|---|---|
| **Representante Digital (herói)** | Q&A com IA que responde dúvidas e insere conteúdo/amostras na conversa | Resolve o problema de atenção e escala a visitação 24/7 |
| **Score de engajamento** | Pontos por check-in, consulta ao assistente, leitura, quiz | Mede e incentiva o relacionamento contínuo |
| **Ranking anônimo e comparativo** | "Você está no Top 5%", "sua especialidade acertou X%" | Mexe com o senso de competência **sem expor nomes** (compliance) |
| **Trilha de conteúdo + quiz** | Conteúdo curto ligado a caso clínico da semana | Educação médica que gera engajamento |
| **Amostras por mérito** | Score/check-in liberam mais amostras | Recompensa concreta e alinhada ao negócio |
| **Camada de IA** | Sugere conteúdo/amostras pelo perfil do médico | Personalização e sensação de "visita sob medida" |
| **Notificações** | WhatsApp/e-mail sobre ranking e amostras | Traz o médico de volta (fora do escopo do MVP) |

## 4. Compliance — regras que moldam o produto

Estas regras vieram da pesquisa do grupo e são **requisitos**, não sugestões:

- **Nunca expor nomes** em rankings públicos. Usar faixas ("Top 5%") e
  pseudônimos/comparativos estatísticos.
- **Badges e score são privados** — só o próprio médico vê o seu.
- **Discurso de educação médica**, evitando linguagem de "jogo/competição".
- O comparativo é sempre **"você vs. a média"**, não "você vs. Fulano".

## 5. Escopo do MVP (esta entrega)

Implementado neste repositório:

- ✅ **Assistente clínico com IA** (chat de Q&A, compliance-safe) como herói, com
  conteúdo/amostras relacionados surgindo na conversa e fallback mock offline
- ✅ Login/perfil do médico (CRM + especialidade), persistido localmente
- ✅ Home com o assistente em destaque e sugestão de conteúdo pela IA
- ✅ Score dinâmico com barra de progresso, streak e detalhamento (bottom sheet)
- ✅ Ações do dia com **check-in interativo** que credita pontos
- ✅ Conteúdo com leitura que credita pontos
- ✅ **Quiz / caso clínico** com correção e explicação
- ✅ **Ranking anônimo e comparativo** (especialidade / regional)
- ✅ **Amostras** com carrinho, limite e recomendação por especialidade
- ✅ **IA funcional** (Claude API) para sugestão personalizada, com fallback mock offline

Fora do escopo do MVP (próximos passos):

- Backend real e autenticação por CRM validada
- Envio real de notificações (WhatsApp/e-mail)
- Catálogo de conteúdo/amostras gerido por admin
- Ranking calculado a partir de dados reais de vários médicos
- Painel do laboratório (visão de "high responders")

## 6. Personas

- **Dr. Pedro Sanches** — cardiologista, usuário final. Quer conteúdo relevante,
  amostras para o consultório e reconhecimento da sua competência.
- **Laboratório (Cuidados Pela Vida)** — quer ampliar alcance, identificar
  médicos engajados e direcionar amostras/conteúdo com eficiência.

## 7. Métricas de sucesso (norte do produto)

Alinhadas à meta do grupo de **aumentar usuários ativos e novos cadastros**:

- Usuários ativos diários/semanais (DAU/WAU)
- Taxa de check-in e de conclusão de conteúdo
- Nº de amostras solicitadas por médico engajado
- Retenção após 30 dias
