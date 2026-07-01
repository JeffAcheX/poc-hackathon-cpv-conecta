import type { Amostra, Conteudo, Especialidade, QuizPergunta, RepLead } from '@/types';
import contentCardiologyImg from '@/assets/illustrations/content-cardiology.png';
import eventWebinarImg from '@/assets/illustrations/event-webinar.png';
import sampleCardiomixImg from '@/assets/illustrations/sample-cardiomix.png';
import sampleVasoprimImg from '@/assets/illustrations/sample-vasoprim.png';

export const ESPECIALIDADES: Especialidade[] = [
  'Cardiologia',
  'Endocrinologia',
  'Clínica Geral',
  'Pediatria',
  'Ortopedia',
];

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
];

// Meta de score para liberar o próximo lote de amostras
export const META_SCORE = 500;

// Limite de amostras que o médico pode solicitar por vez
export const LIMITE_AMOSTRAS = 12;

export const CONTEUDOS: Conteudo[] = [
  {
    id: 'c-cardio-genericos',
    tipo: 'Artigo',
    especialidade: 'Cardiologia',
    titulo: 'Genéricos, similares e de marca: a diferença na hora de indicar',
    resumo:
      'Um guia rápido para esclarecer a diferença entre as três categorias e quando cada uma faz sentido na prática clínica.',
    duracaoMin: 4,
    pontos: 15,
    corThumb: '#C8B6D6',
    imagem: contentCardiologyImg,
    corpo: [
      'Na rotina do consultório, a escolha entre um medicamento genérico, similar ou de marca costuma gerar dúvidas — tanto no médico quanto no paciente.',
      'O genérico contém o mesmo princípio ativo, na mesma dose e forma farmacêutica do medicamento de referência, com bioequivalência comprovada pela Anvisa.',
      'O similar também possui o mesmo princípio ativo e indicação, mas é comercializado com nome de marca próprio. Desde 2014, os similares intercambiáveis passaram por testes de equivalência.',
      'O de marca (referência) é o produto original, que foi objeto do desenvolvimento e dos estudos clínicos que sustentam a molécula.',
      'Na prática: para adesão ao tratamento, o custo pesa. Explicar essa diferença de forma clara aumenta a confiança do paciente e a continuidade da terapia.',
    ],
  },
  {
    id: 'c-cardio-arritmias',
    tipo: 'Vídeo',
    especialidade: 'Cardiologia',
    titulo: 'Manejo rápido de arritmias na atenção primária',
    resumo: 'Vídeo de 3 minutos com os pontos essenciais de conduta inicial.',
    duracaoMin: 3,
    pontos: 15,
    corThumb: '#B9A6CF',
    corpo: [
      'As arritmias mais frequentes na atenção primária incluem a fibrilação atrial e as extrassístoles.',
      'O primeiro passo é sempre a estratificação de risco e a avaliação de instabilidade hemodinâmica.',
      'Para fibrilação atrial, a decisão entre controle de ritmo e controle de frequência depende do quadro clínico e das comorbidades.',
      'A anticoagulação deve ser considerada com base no escore CHA₂DS₂-VASc.',
    ],
  },
  {
    id: 'c-endo-diabetes',
    tipo: 'Artigo',
    especialidade: 'Endocrinologia',
    titulo: 'Novas metas glicêmicas: o que mudou nas diretrizes de 2026',
    resumo: 'Atualização objetiva sobre alvos de HbA1c e individualização do tratamento.',
    duracaoMin: 5,
    pontos: 20,
    corThumb: '#C8B6D6',
    corpo: [
      'As diretrizes de 2026 reforçam a individualização das metas glicêmicas conforme perfil e risco do paciente.',
      'Para a maioria dos adultos, a meta de HbA1c permanece abaixo de 7%.',
      'Em idosos frágeis ou com histórico de hipoglicemia, alvos menos rígidos (7,5–8%) são preferíveis.',
      'A escolha da terapia deve priorizar classes com benefício cardiovascular e renal comprovado.',
    ],
  },
  {
    id: 'c-geral-adesao',
    tipo: 'Caso clínico',
    especialidade: 'Clínica Geral',
    titulo: 'Caso clínico: melhorando a adesão ao tratamento crônico',
    resumo: 'Um caso comentado sobre estratégias práticas de adesão terapêutica.',
    duracaoMin: 6,
    pontos: 30,
    corThumb: '#B9A6CF',
    corpo: [
      'Paciente de 58 anos, hipertenso e diabético, com controle irregular por baixa adesão.',
      'A investigação revelou dificuldade financeira e regime posológico complexo como principais barreiras.',
      'A simplificação do esquema e a discussão sobre alternativas de menor custo melhoraram a adesão.',
      'O acompanhamento próximo, com metas compartilhadas, foi decisivo para o resultado.',
    ],
  },
  {
    id: 'c-webinar-2026',
    tipo: 'Webinar',
    especialidade: 'Geral',
    titulo: 'Atualizações em manejo de doenças crônicas para 2026',
    resumo: 'Evento online com especialistas convidados.',
    duracaoMin: 45,
    pontos: 40,
    corThumb: '#B9A6CF',
    imagem: eventWebinarImg,
    corpo: [
      'Webinar com painel de especialistas discutindo as principais atualizações do ano.',
      'Inclui sessão de perguntas e respostas ao vivo.',
    ],
  },
];

export const AMOSTRAS: Amostra[] = [
  {
    id: 'a-cardiomix',
    nome: 'Cardiomix',
    categoria: 'Anti-hipertensivo',
    descricao: 'Amostra para avaliação em pacientes com hipertensão leve a moderada.',
    especialidade: 'Cardiologia',
    imagem: sampleCardiomixImg,
  },
  {
    id: 'a-vasoprim',
    nome: 'Vasoprim',
    categoria: 'Vasodilatador',
    descricao: 'Indicado para manejo de insuficiência vascular periférica.',
    especialidade: 'Cardiologia',
    imagem: sampleVasoprimImg,
  },
  {
    id: 'a-cardiomix-plus',
    nome: 'Cardiomix Plus',
    categoria: 'Anti-hipertensivo combinado',
    descricao: 'Combinação para pacientes que precisam de controle adicional.',
    especialidade: 'Cardiologia',
  },
  {
    id: 'a-glicoreg',
    nome: 'Glicoreg',
    categoria: 'Antidiabético oral',
    descricao: 'Amostra para controle glicêmico em diabetes tipo 2.',
    especialidade: 'Endocrinologia',
  },
  {
    id: 'a-vitaplus',
    nome: 'Vitaplus',
    categoria: 'Suplemento',
    descricao: 'Suporte nutricional de amplo uso clínico.',
    especialidade: 'Geral',
  },
];

export const QUIZZES: QuizPergunta[] = [
  {
    id: 'q-cardio-1',
    especialidade: 'Cardiologia',
    pergunta:
      'Em um paciente com fibrilação atrial e CHA₂DS₂-VASc = 3, qual a conduta mais adequada quanto à anticoagulação?',
    opcoes: [
      'Não anticoagular, apenas AAS',
      'Anticoagulação oral está indicada',
      'Aguardar novo episódio para decidir',
      'Encaminhar sem conduta inicial',
    ],
    respostaCorreta: 1,
    explicacao:
      'Com CHA₂DS₂-VASc ≥ 2 em homens, a anticoagulação oral plena está indicada para prevenção de eventos tromboembólicos.',
    pontos: 25,
  },
  {
    id: 'q-endo-1',
    especialidade: 'Endocrinologia',
    pergunta:
      'Qual a meta de HbA1c recomendada para a maioria dos adultos com diabetes tipo 2, segundo as diretrizes de 2026?',
    opcoes: ['Abaixo de 6%', 'Abaixo de 7%', 'Abaixo de 8,5%', 'Não há meta definida'],
    respostaCorreta: 1,
    explicacao:
      'Para a maioria dos adultos, a meta permanece abaixo de 7%, individualizando em idosos frágeis.',
    pontos: 25,
  },
  {
    id: 'q-geral-1',
    especialidade: 'Geral',
    pergunta:
      'Qual estratégia tem maior impacto na adesão ao tratamento crônico segundo a literatura?',
    opcoes: [
      'Aumentar o número de medicamentos',
      'Simplificar o esquema posológico',
      'Reduzir o tempo de consulta',
      'Evitar discutir custos com o paciente',
    ],
    respostaCorreta: 1,
    explicacao:
      'A simplificação do regime posológico e o compartilhamento de metas são das estratégias mais eficazes para adesão.',
    pontos: 25,
  },
];

// Ranking comparativo anônimo (compliance): nunca expõe nomes de médicos.
export interface RankingComparativo {
  suaFaixa: string; // ex: "Top 5%"
  seuAcerto: number; // % de acerto do médico
  mediaEspecialidade: number; // % média
  totalComparados: number;
}

export const RANKING: RankingComparativo = {
  suaFaixa: 'Top 5%',
  seuAcerto: 85,
  mediaEspecialidade: 60,
  totalComparados: 1240,
};

// ---------- Cadência semanal do agente ----------
// Dá ritmo ao engajamento: cada dia da semana tem um tema, mensagem de
// abertura e formato de interação próprios (ver WeeklyAgendaCard).

export interface AgendaDiaInfo {
  tema: string;
  mensagem: string;
}

// índice 0 = domingo ... 6 = sábado (bate com Date.getDay())
export const WEEKLY_AGENDA: AgendaDiaInfo[] = [
  {
    tema: 'Dia de descanso',
    mensagem:
      'Sem tarefas hoje. Amanhã começamos a semana com sua visita inteligente.',
  },
  {
    tema: 'Visita inteligente',
    mensagem: 'Estou aqui para entender o que você precisa hoje.',
  },
  {
    tema: 'Conteúdo científico',
    mensagem: 'Separei um conteúdo rápido da sua especialidade.',
  },
  {
    tema: 'Caso clínico',
    mensagem: '3 perguntas rápidas sobre sua rotina clínica.',
  },
  {
    tema: 'Quiz da semana',
    mensagem: 'Uma pergunta que conecta conteúdo e amostra.',
  },
  {
    tema: 'Fechamento da semana',
    mensagem: 'Uma ótima semana! Confira seu resumo.',
  },
  {
    tema: 'Exclusivo para você',
    mensagem: 'Conteúdo e evento selecionados especialmente.',
  },
];

// 3 perguntas rápidas de "pulso" sobre a rotina clínica (não são avaliadas
// como certo/errado — servem para o perfil de indicação do médico).
export interface PerguntaCasoSemanal {
  pergunta: string;
  opcoes: string[];
}

export const CASO_CLINICO_SEMANAL: Record<
  Especialidade | 'Geral',
  PerguntaCasoSemanal[]
> = {
  Cardiologia: [
    {
      pergunta: 'Com que frequência você atende casos de hipertensão resistente?',
      opcoes: ['Raramente', 'Às vezes', 'Frequentemente'],
    },
    {
      pergunta: 'Qual classe terapêutica você mais prescreve atualmente?',
      opcoes: ['Anti-hipertensivos', 'Anticoagulantes', 'Estatinas'],
    },
    {
      pergunta: 'Como costuma acompanhar a adesão do paciente ao tratamento?',
      opcoes: ['Retorno presencial', 'Contato remoto', 'Ambos'],
    },
  ],
  Endocrinologia: [
    {
      pergunta: 'Qual o perfil mais comum dos seus pacientes com diabetes tipo 2?',
      opcoes: ['Recém-diagnosticados', 'Em ajuste de tratamento', 'Casos avançados'],
    },
    {
      pergunta: 'Com que frequência você revisa metas glicêmicas individualizadas?',
      opcoes: ['A cada consulta', 'A cada poucos meses', 'Raramente'],
    },
    {
      pergunta: 'Qual classe terapêutica você mais prescreve atualmente?',
      opcoes: ['Antidiabéticos orais', 'Insulinas', 'Combinações'],
    },
  ],
  'Clínica Geral': [
    {
      pergunta: 'Qual desafio mais comum na adesão ao tratamento crônico?',
      opcoes: ['Custo do medicamento', 'Esquema complexo', 'Falta de acompanhamento'],
    },
    {
      pergunta: 'Com que frequência você indica genéricos aos pacientes?',
      opcoes: ['Sempre que possível', 'Depende do caso', 'Raramente'],
    },
    {
      pergunta: 'Como prefere acompanhar pacientes crônicos entre consultas?',
      opcoes: ['Retorno presencial', 'Contato remoto', 'Ambos'],
    },
  ],
  Pediatria: [
    {
      pergunta: 'Qual faixa etária você mais atende no consultório?',
      opcoes: ['0-2 anos', '3-8 anos', '9-12 anos'],
    },
    {
      pergunta: 'Qual o principal desafio na adesão ao tratamento pediátrico?',
      opcoes: ['Sabor/aceitação', 'Esquecimento dos pais', 'Custo'],
    },
    {
      pergunta: 'Com que frequência você orienta sobre suplementação?',
      opcoes: ['Rotineiramente', 'Sob demanda', 'Raramente'],
    },
  ],
  Ortopedia: [
    {
      pergunta: 'Qual tipo de caso você mais atende atualmente?',
      opcoes: ['Lesões agudas', 'Dor crônica', 'Pós-operatório'],
    },
    {
      pergunta: 'Com que frequência você indica fisioterapia associada?',
      opcoes: ['Sempre', 'Depende do caso', 'Raramente'],
    },
    {
      pergunta: 'Qual classe terapêutica você mais prescreve para dor?',
      opcoes: ['Anti-inflamatórios', 'Analgésicos', 'Relaxantes musculares'],
    },
  ],
  Geral: [
    {
      pergunta: 'Com que frequência você indica genéricos aos pacientes?',
      opcoes: ['Sempre que possível', 'Depende do caso', 'Raramente'],
    },
    {
      pergunta: 'Qual o principal desafio na adesão ao tratamento?',
      opcoes: ['Custo', 'Esquema complexo', 'Falta de acompanhamento'],
    },
    {
      pergunta: 'Como prefere se manter atualizado cientificamente?',
      opcoes: ['Artigos', 'Eventos/webinars', 'Discussão com colegas'],
    },
  ],
};

// ---------- Painel do representante ----------
// Carteira de médicos acompanhada pelo representante, com sinais de
// engajamento e próxima ação sugerida (visão comercial).

export const REP_LEADS: RepLead[] = [
  {
    id: 'lead-1',
    nome: 'Dr. Pedro Sanches',
    especialidade: 'Cardiologia',
    uf: 'SP',
    engajamento: 82,
    intencao: 'Alto',
    proximaAcao: 'Convidar para o webinar de arritmias desta semana',
    canalSugerido: 'whatsapp',
    ultimoSinal: 'Respondeu o quiz da semana há 2 dias',
  },
  {
    id: 'lead-2',
    nome: 'Dra. Marina Alves',
    especialidade: 'Endocrinologia',
    uf: 'MG',
    engajamento: 64,
    intencao: 'Médio',
    proximaAcao: 'Enviar conteúdo sobre metas glicêmicas 2026',
    canalSugerido: 'email',
    ultimoSinal: 'Leu 1 conteúdo nos últimos 7 dias',
  },
  {
    id: 'lead-3',
    nome: 'Dr. Renato Lima',
    especialidade: 'Clínica Geral',
    uf: 'RJ',
    engajamento: 38,
    intencao: 'Baixo',
    proximaAcao: 'Reengajar com amostra de baixo custo',
    canalSugerido: 'visita',
    ultimoSinal: 'Sem interações há 18 dias',
  },
  {
    id: 'lead-4',
    nome: 'Dra. Camila Rocha',
    especialidade: 'Pediatria',
    uf: 'PR',
    engajamento: 91,
    intencao: 'Alto',
    proximaAcao: 'Priorizar solicitação de amostras pendente',
    canalSugerido: 'whatsapp',
    ultimoSinal: 'Solicitou amostras há 1 dia',
  },
];
