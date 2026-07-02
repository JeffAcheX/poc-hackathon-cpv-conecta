import type {
  ChatMessage,
  Conteudo,
  Especialidade,
  Medico,
  RespostaAssistente,
  SugestaoIA,
} from '@/types';
import { AMOSTRAS, CONTEUDOS } from '@/data/mockData';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
const MODEL =
  (import.meta.env.VITE_ANTHROPIC_MODEL as string | undefined) ||
  'claude-haiku-4-5-20251001';

export function iaAtiva(): boolean {
  return Boolean(API_KEY && API_KEY.trim().length > 0);
}

/**
 * Sugestões de pergunta sobre medicamentos, personalizadas pela especialidade
 * do médico logado (usadas como atalhos no Representante Digital).
 */
export function sugestoesMedicamento(medico: Medico | null): string[] {
  if (!medico) return [];
  const doEspecialidade = AMOSTRAS.filter(
    (a) => a.especialidade === medico.especialidade,
  );
  const geral = AMOSTRAS.filter((a) => a.especialidade === 'Geral');
  const amostras = doEspecialidade.length > 0 ? doEspecialidade : geral;

  const porMedicamento = amostras.slice(0, 2).map((a) => `Quando indicar ${a.nome}?`);
  const genericas = [
    'Como melhorar a adesão ao tratamento?',
    'Genérico, similar ou de marca: qual indicar?',
  ];
  return [...porMedicamento, ...genericas].slice(0, 3);
}

/**
 * Gera uma sugestão personalizada para o médico.
 * Usa a Claude API quando há chave; caso contrário, cai num mock determinístico.
 */
export async function gerarSugestao(
  medico: Medico,
  score: number,
): Promise<SugestaoIA> {
  if (!iaAtiva()) {
    return sugestaoMock(medico);
  }
  try {
    return await sugestaoClaude(medico, score);
  } catch (err) {
    console.warn('[IA] Falha ao chamar Claude, usando fallback mock:', err);
    return sugestaoMock(medico);
  }
}

// ---------- Assistente clínico (Q&A) ----------

/**
 * Responde a uma pergunta clínica/de produto do médico.
 * Usa a Claude API quando há chave; caso contrário, um fallback mock plausível.
 * Os conteúdos/amostras relacionados são calculados localmente (robusto e
 * independente do formato da resposta).
 */
export async function responderPergunta(
  medico: Medico,
  pergunta: string,
  historico: ChatMessage[],
): Promise<RespostaAssistente> {
  const relacionados = relacionar(medico, pergunta);

  if (!iaAtiva()) {
    await delayPensando();
    return { ...respostaMock(medico, pergunta), ...relacionados, fonte: 'mock' };
  }
  try {
    const resposta = await respostaClaude(medico, pergunta, historico);
    // relaciona usando pergunta + resposta para chips mais precisos
    const rel = relacionar(medico, pergunta + ' ' + resposta);
    return { resposta, ...rel, fonte: 'ia' };
  } catch (err) {
    console.warn('[IA] Falha no assistente, usando fallback mock:', err);
    await delayPensando();
    return { ...respostaMock(medico, pergunta), ...relacionados, fonte: 'mock' };
  }
}

const SYSTEM_ASSISTENTE = `Você é o Representante Digital da plataforma "Cuidados Pela Vida", de um laboratório farmacêutico. Seu papel é esclarecer dúvidas do médico sobre medicamentos e tratamentos — é a "visita médica digital".

Diretrizes:
- Foque em dúvidas de medicamentos e tratamentos, personalizando a resposta para a especialidade do médico logado.
- Responda em português do Brasil, de forma objetiva e profissional (2 a 5 frases).
- Baseie-se em evidência; quando pertinente, mencione que a conduta deve considerar o quadro individual do paciente.
- Quando a pergunta envolver um medicamento do catálogo da farmacêutica listado abaixo, mencione-o pelo nome — o sistema anexa automaticamente o link da amostra/medicamento na conversa.
- Foco educacional. NÃO faça promoção off-label, não prometa eficácia absoluta e lembre, quando relevante, de consultar a bula/prescrição completa.
- Nunca cite outros médicos nem dados de pacientes reais.
- Se a pergunta fugir do escopo de medicamentos/tratamentos, redirecione com gentileza.
- Não use formatação markdown pesada; texto corrido curto.`;

async function respostaClaude(
  medico: Medico,
  pergunta: string,
  historico: ChatMessage[],
): Promise<string> {
  const medicamentosDaEspecialidade = AMOSTRAS.filter(
    (a) => a.especialidade === medico.especialidade || a.especialidade === 'Geral',
  )
    .map((a) => `${a.nome} (${a.categoria})`)
    .join(', ');
  const contexto = `Perfil do médico: ${medico.especialidade}, ${medico.uf}. Medicamentos do laboratório relevantes para a especialidade: ${medicamentosDaEspecialidade || 'nenhum específico'}.`;
  const msgs = historico.slice(-6).map((m) => ({
    role: m.autor === 'medico' ? ('user' as const) : ('assistant' as const),
    content: m.texto,
  }));
  msgs.push({ role: 'user', content: `${contexto}\n\nPergunta: ${pergunta}` });

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY as string,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM_ASSISTENTE,
      messages: msgs,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Claude API ${resp.status}: ${await resp.text()}`);
  }
  const data = (await resp.json()) as ClaudeResponse;
  const text = data.content?.find((b) => b.type === 'text')?.text?.trim();
  if (!text) throw new Error('Resposta vazia do assistente');
  return text;
}

// aguarda um tempo aleatório, simulando o "pensar" de uma IA de verdade
function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function delayPensando(): Promise<void> {
  return aguardar(1500 + Math.random() * 1300);
}

// escolha pseudo-aleatória, mas estável para a mesma pergunta (evita repetir
// sempre a mesma variação para perguntas diferentes do mesmo tópico)
function escolher<T>(lista: T[], semente: string): T {
  let h = 0;
  for (const c of semente) h = (h * 31 + c.charCodeAt(0)) % 997;
  return lista[h % lista.length];
}

type GeradorResposta = (nome: string) => string;

const RESPOSTAS_MEDICAMENTO: Record<string, GeradorResposta> = {
  cardiomix: (nome) =>
    `${nome}, Cardiomix é indicado para hipertensão leve a moderada, especialmente quando o paciente ainda não está controlado com medidas não farmacológicas. O perfil de tolerabilidade costuma favorecer a adesão a longo prazo.`,
  vasoprim: (nome) =>
    `Para quadros de insuficiência vascular periférica, ${nome}, Vasoprim costuma ser uma boa opção — vale reforçar com o paciente que a resposta clínica é gradual, geralmente perceptível a partir de algumas semanas de uso contínuo.`,
  'cardiomix plus': (nome) =>
    `Cardiomix Plus entra bem quando o paciente já usa um anti-hipertensivo e precisa de controle adicional, ${nome}. Por ser uma combinação, ajuda a simplificar o esquema posológico em vez de somar mais um comprimido separado.`,
  glicoreg: (nome) =>
    `${nome}, Glicoreg é indicado para controle glicêmico em diabetes tipo 2, com bom perfil para uso combinado. Vale reavaliar a resposta em 8 a 12 semanas antes de intensificar o tratamento.`,
  vitaplus: (nome) =>
    `Vitaplus funciona como suporte nutricional complementar, ${nome} — não substitui o tratamento principal, mas pode ser útil em pacientes com maior demanda nutricional ou baixa ingestão alimentar.`,
};

const RESPOSTAS_ADESAO: GeradorResposta[] = [
  (nome) =>
    `Na minha experiência com outros médicos da plataforma, ${nome}, simplificar o esquema posológico é o que mais move o ponteiro na adesão — menos comprimidos por dia costuma valer mais do que qualquer orientação verbal.`,
  (nome) =>
    `${nome}, além de simplificar a posologia, discutir custo abertamente com o paciente ajuda bastante: parte importante do abandono de tratamento crônico vem de dificuldade financeira não verbalizada na consulta.`,
];

const RESPOSTAS_GENERICO: GeradorResposta[] = [
  (nome) =>
    `${nome}, o genérico tem o mesmo princípio ativo e bioequivalência comprovada pela Anvisa — é a opção de menor custo. O similar também é equivalente, mas com marca própria. O de marca é o produto de referência, com o histórico de estudos clínicos originais.`,
  (nome) =>
    `Na prática, ${nome}, a escolha entre genérico, similar e de marca costuma pesar mais no bolso do paciente do que na eficácia — os três têm o mesmo princípio ativo. Explicar essa diferença ajuda a manter a continuidade do tratamento.`,
];

const RESPOSTAS_GERAL: Record<Especialidade | 'Geral', GeradorResposta[]> = {
  Cardiologia: [
    (nome) =>
      `Boa pergunta, ${nome}. Em cardiologia, a decisão costuma passar por estratificação de risco cardiovascular antes de qualquer ajuste terapêutico — vale sempre revisar as comorbidades associadas.`,
    (nome) =>
      `${nome}, de forma geral vale considerar o perfil de risco individual do paciente e as diretrizes vigentes antes de definir a conduta — cada caso pode pedir uma abordagem diferente.`,
  ],
  Endocrinologia: [
    (nome) =>
      `${nome}, em endocrinologia a individualização da meta terapêutica costuma ser o ponto-chave — idade, tempo de doença e comorbidades mudam bastante a conduta recomendada.`,
    (nome) =>
      `Boa pergunta, ${nome}. Vale sempre reavaliar a resposta terapêutica em algumas semanas antes de intensificar o tratamento, considerando o perfil metabólico do paciente.`,
  ],
  'Clínica Geral': [
    (nome) =>
      `${nome}, na clínica geral o mais importante costuma ser olhar o paciente de forma integral — a resposta a um tratamento raramente depende só da prescrição em si.`,
    (nome) =>
      `Boa pergunta, ${nome}. Vale sempre considerar o contexto clínico completo do paciente e as diretrizes vigentes antes de definir a conduta.`,
  ],
  Pediatria: [
    (nome) =>
      `${nome}, em pediatria o ajuste por peso e a orientação clara aos responsáveis costumam ser decisivos para o sucesso do tratamento.`,
    (nome) =>
      `Boa pergunta, ${nome}. Vale sempre revisar a faixa etária e o peso do paciente antes de definir dose e conduta.`,
  ],
  Ortopedia: [
    (nome) =>
      `${nome}, em ortopedia vale sempre equilibrar controle da dor e funcionalidade — a conduta muda bastante conforme o estágio da lesão ou condição.`,
    (nome) =>
      `Boa pergunta, ${nome}. De forma geral, considerar o quadro funcional do paciente ajuda a guiar a escolha entre conduta conservadora e mais intervencionista.`,
  ],
  Geral: [
    (nome) =>
      `Boa pergunta, ${nome}. De forma geral, a conduta deve considerar o quadro individual do paciente e as diretrizes vigentes.`,
    (nome) =>
      `${nome}, vale sempre avaliar o contexto clínico completo antes de definir a conduta mais adequada para esse caso.`,
  ],
};

function respostaMock(
  medico: Medico,
  pergunta: string,
): { resposta: string } {
  const nome = extrairPrimeiroNome(medico.nome);
  const termos = normalizar(pergunta);
  const textoNorm = ` ${termos.join(' ')} `;

  const amostraCitada = AMOSTRAS.find((a) =>
    textoNorm.includes(` ${normalizar(a.nome).join(' ')} `),
  );
  const geradorMedicamento = amostraCitada
    ? RESPOSTAS_MEDICAMENTO[amostraCitada.nome.toLowerCase()]
    : undefined;

  let nucleo: string;
  if (geradorMedicamento) {
    nucleo = geradorMedicamento(nome);
  } else if (termos.some((t) => t.startsWith('ades') || t.startsWith('adere'))) {
    nucleo = escolher(RESPOSTAS_ADESAO, pergunta)(nome);
  } else if (termos.some((t) => ['generico', 'similar', 'marca'].includes(t))) {
    nucleo = escolher(RESPOSTAS_GENERICO, pergunta)(nome);
  } else {
    const geral = RESPOSTAS_GERAL[medico.especialidade] ?? RESPOSTAS_GERAL.Geral;
    nucleo = escolher(geral, pergunta)(nome);
  }

  const rel = relacionar(medico, pergunta);
  const conteudo = CONTEUDOS.find((c) => c.id === rel.conteudosRelacionados[0]);
  const amostraPrincipal = rel.amostrasRelacionadas[0];
  const refConteudo = conteudo
    ? ` Um ponto de partida é o material "${conteudo.titulo}".`
    : '';
  const refAmostra =
    amostraPrincipal && amostraPrincipal !== amostraCitada?.nome
      ? ` Deixei disponível a amostra de ${amostraPrincipal} relacionada ao tema.`
      : '';

  return { resposta: nucleo + refConteudo + refAmostra };
}

// Relaciona conteúdos/amostras ao texto: prioriza medicamento citado pelo nome
// (garante o link de amostra/medicamento quando a conversa menciona um produto),
// senão usa especialidade + sobreposição de palavras.
function relacionar(
  medico: Medico,
  texto: string,
): { conteudosRelacionados: string[]; amostrasRelacionadas: string[] } {
  const termos = normalizar(texto);
  const textoNormalizado = ` ${termos.join(' ')} `;

  const conteudosOrdenados = [...CONTEUDOS]
    .map((c) => ({ c, score: pontuarRelevancia(c, medico, termos) }))
    .sort((a, b) => b.score - a.score)
    .filter((x) => x.score > 0)
    .slice(0, 2)
    .map((x) => x.c.id);

  const citadas = AMOSTRAS.filter((a) =>
    textoNormalizado.includes(` ${normalizar(a.nome).join(' ')} `),
  );
  const porEspecialidade = AMOSTRAS.filter(
    (a) => a.especialidade === medico.especialidade,
  );
  const amostras = citadas.length > 0 ? citadas : porEspecialidade;

  return {
    conteudosRelacionados: conteudosOrdenados.length
      ? conteudosOrdenados
      : conteudosDoMedico(medico)
          .slice(0, 1)
          .map((c) => c.id),
    amostrasRelacionadas: amostras.length
      ? amostras.slice(0, 2).map((a) => a.nome)
      : [AMOSTRAS[0].nome],
  };
}

function pontuarRelevancia(
  c: Conteudo,
  medico: Medico,
  termos: string[],
): number {
  let score = 0;
  if (c.especialidade === medico.especialidade) score += 2;
  const alvo = normalizar(`${c.titulo} ${c.resumo} ${c.especialidade}`);
  for (const t of termos) {
    if (t.length >= 4 && alvo.includes(t)) score += 1;
  }
  return score;
}

function normalizar(texto: string): string[] {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// ---------- Fallback mock (offline) ----------

// ignora prefixos como "Dr."/"Dra." ao extrair o primeiro nome
function extrairPrimeiroNome(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const semTitulo = partes.filter((p) => !/^dr[a]?\.?$/i.test(p));
  return semTitulo[0] || partes[0] || 'Doutor(a)';
}

function conteudosDoMedico(medico: Medico): Conteudo[] {
  const daEspecialidade = CONTEUDOS.filter(
    (c) => c.especialidade === medico.especialidade,
  );
  return daEspecialidade.length > 0 ? daEspecialidade : CONTEUDOS;
}

export function sugestaoMock(medico: Medico): SugestaoIA {
  const conteudos = conteudosDoMedico(medico);
  const conteudo = conteudos[0];
  const amostras = AMOSTRAS.filter(
    (a) => a.especialidade === medico.especialidade,
  )
    .slice(0, 2)
    .map((a) => a.nome);

  const primeiroNome = extrairPrimeiroNome(medico.nome);

  return {
    saudacao: `Preparamos um resumo rápido de ${medico.especialidade.toLowerCase()} para você hoje.`,
    conteudoId: conteudo.id,
    motivo: `Como você atua em ${medico.especialidade}, este conteúdo de ${conteudo.duracaoMin} min é um bom ponto de partida, ${primeiroNome}.`,
    amostrasSugeridas: amostras.length ? amostras : [AMOSTRAS[0].nome],
    fonte: 'mock',
  };
}

// ---------- Claude API (browser direct) ----------

interface ClaudeContentBlock {
  type: string;
  text?: string;
}
interface ClaudeResponse {
  content?: ClaudeContentBlock[];
}

async function sugestaoClaude(
  medico: Medico,
  score: number,
): Promise<SugestaoIA> {
  const catalogo = CONTEUDOS.map(
    (c) => `- id:${c.id} | ${c.tipo} | ${c.especialidade} | ${c.titulo} (${c.duracaoMin}min)`,
  ).join('\n');
  const amostrasCat = AMOSTRAS.map(
    (a) => `- ${a.nome} (${a.especialidade}) — ${a.categoria}`,
  ).join('\n');

  const prompt = `Você é o assistente de visita médica digital da plataforma "Cuidados Pela Vida".
Perfil do médico:
- Nome: ${medico.nome}
- Especialidade: ${medico.especialidade}
- UF: ${medico.uf}
- Score atual de engajamento: ${score} pts

Catálogo de conteúdos disponíveis:
${catalogo}

Catálogo de amostras disponíveis:
${amostrasCat}

Tarefa: recomende UM conteúdo do catálogo (pelo id) e até 2 amostras coerentes com a especialidade.
Regras de compliance: tom profissional, sem linguagem de "jogo/competição", foco em educação médica. Nunca cite outros médicos.

Responda APENAS com um JSON válido, sem markdown, no formato:
{"saudacao": "frase curta e acolhedora", "conteudoId": "id do catálogo", "motivo": "1 frase explicando a escolha", "amostrasSugeridas": ["nome1","nome2"]}`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY as string,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!resp.ok) {
    throw new Error(`Claude API ${resp.status}: ${await resp.text()}`);
  }

  const data = (await resp.json()) as ClaudeResponse;
  const text = data.content?.find((b) => b.type === 'text')?.text ?? '';
  const parsed = extrairJson(text);

  // valida o conteúdo sugerido; se inválido, usa fallback
  const existe = CONTEUDOS.some((c) => c.id === parsed.conteudoId);
  const base = sugestaoMock(medico);

  return {
    saudacao: parsed.saudacao || base.saudacao,
    conteudoId: existe && parsed.conteudoId ? parsed.conteudoId : base.conteudoId,
    motivo: parsed.motivo || base.motivo,
    amostrasSugeridas:
      Array.isArray(parsed.amostrasSugeridas) && parsed.amostrasSugeridas.length
        ? parsed.amostrasSugeridas.slice(0, 2)
        : base.amostrasSugeridas,
    fonte: 'ia',
  };
}

interface RespParcial {
  saudacao?: string;
  conteudoId?: string;
  motivo?: string;
  amostrasSugeridas?: string[];
}

function extrairJson(text: string): RespParcial {
  try {
    const inicio = text.indexOf('{');
    const fim = text.lastIndexOf('}');
    if (inicio === -1 || fim === -1) return {};
    return JSON.parse(text.slice(inicio, fim + 1)) as RespParcial;
  } catch {
    return {};
  }
}
