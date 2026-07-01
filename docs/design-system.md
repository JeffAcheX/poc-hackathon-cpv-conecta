# Sistema de Design — v2 (marca real)

Aplicado a partir dos princípios de design em `.claude/` e ancorado na
**identidade oficial do Cuidados Pela Vida (Aché)**. Os tokens vivem em
[`tailwind.config.js`](../tailwind.config.js); as fontes são carregadas em
[`index.html`](../index.html).

## Cores

A marca usa **roxo `#5C3078`** como primária (padrão de botões/cards do portal
do médico), com um tom mais claro como secundária/background — a mesma
paleta do protótipo original do time.

| Token | Hex | Uso |
|---|---|---|
| `brand` | `#5C3078` | Primária — botões e cards de destaque |
| `brand-soft` | `#8C5FA8` | Tom mais claro, acentos |
| `brand-bg` | `#F2EAF6` | Tom mais claro, secundária/background |
| `brand-deep` | `#2B1638` | Superfícies escuras premium (herói, login) |
| `ink` / `ink-sub` | `#241E29` / `#726B78` | Texto (quase-preto / secundário) |
| `canvas` | `#F7F4F8` | Fundo de tela (papel neutro) |
| `brandgreen` | `#0F9D6B` | Sucesso / pontos creditados |

Botões seguem o padrão: **Primário** (fill roxo, texto branco), **Secundário**
(borda cinza clara, fundo branco, texto roxo — `.btn-secondary`) e **Ghost**
(texto roxo, sem fundo/borda — `.btn-ghost`).

## Tipografia

- **Display (títulos):** Bricolage Grotesque — caráter editorial, com
  personalidade, evitando fontes "de template".
- **Corpo:** Hanken Grotesk — sans humanista, limpa e legível.

Aplicadas via `h1/h2/h3` (display) e `body` (corpo) em [`index.css`](../src/index.css).

## Princípios aplicados (anti "AI slop")

Seguindo o design system prompt, evitamos os clichês de IA:

- **Sem gradientes agressivos** — superfícies planas: magenta chapado (score),
  plum profundo (herói/login). Profundidade vem de sombra suave, não de gradiente.
- **Sem emoji** — substituídos pelo set de ícones próprio (chama para streak,
  artigo/amostra nos chips, etc).
- **Sem fonte de sistema** — tipografia com caráter (ver acima).
- **Placeholders honestos** — thumbnails de conteúdo são blocos de cor da marca,
  não ilustrações SVG mal-acabadas.

## Próximos passos de design (quando houver)

- Confirmar/obter os ativos oficiais (logo em vetor, tom exato do magenta,
  fontes de marca) do portal `profissionais.cuidadospelavida.com.br`.
- Explorar um segundo tom de apoio além do plum, se necessário.
- Estados de foco/acessibilidade e checagem de contraste AA nos textos pequenos
  sobre magenta.
