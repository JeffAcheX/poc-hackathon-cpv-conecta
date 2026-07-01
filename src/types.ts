// Tipos de domínio do MVP "Visita Médica Digital"

export type Especialidade =
  | 'Cardiologia'
  | 'Endocrinologia'
  | 'Clínica Geral'
  | 'Pediatria'
  | 'Ortopedia';

export type Papel = 'medico' | 'representante';

export interface Medico {
  papel: Papel;
  nome: string;
  crm: string;
  uf: string;
  especialidade: Especialidade;
}

export type IntencaoLead = 'Alto' | 'Médio' | 'Baixo';
export type CanalSugerido = 'whatsapp' | 'email' | 'visita';

// Carteira de médicos acompanhada pelo representante (visão comercial)
export interface RepLead {
  id: string;
  nome: string;
  especialidade: Especialidade;
  uf: string;
  engajamento: number; // score de engajamento do médico, 0-100
  intencao: IntencaoLead;
  proximaAcao: string;
  canalSugerido: CanalSugerido;
  ultimoSinal: string;
}

export type ConteudoTipo = 'Artigo' | 'Vídeo' | 'Caso clínico' | 'Webinar';

export interface Conteudo {
  id: string;
  tipo: ConteudoTipo;
  especialidade: Especialidade | 'Geral';
  titulo: string;
  resumo: string;
  duracaoMin: number;
  pontos: number;
  corThumb: string;
  imagem?: string; // ilustração real; quando ausente, usa corThumb como placeholder
  corpo: string[]; // parágrafos do conteúdo
}

export interface Amostra {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  especialidade: Especialidade | 'Geral';
  imagem?: string;
}

export interface QuizPergunta {
  id: string;
  especialidade: Especialidade | 'Geral';
  pergunta: string;
  opcoes: string[];
  respostaCorreta: number;
  explicacao: string;
  pontos: number;
}

export type AcaoTipo =
  | 'checkin'
  | 'leitura'
  | 'quiz'
  | 'video'
  | 'webinar'
  | 'caso-clinico'
  | 'pergunta';

export interface EventoScore {
  id: string;
  tipo: AcaoTipo;
  descricao: string;
  pontos: number;
  data: string; // ISO
}

// Mensagem do chat do assistente clínico
export interface ChatMessage {
  autor: 'medico' | 'assistente';
  texto: string;
  conteudosRelacionados?: string[]; // ids de Conteudo
  amostrasRelacionadas?: string[]; // nomes de Amostra
}

// Resposta do assistente clínico (IA ou fallback)
export interface RespostaAssistente {
  resposta: string;
  conteudosRelacionados: string[];
  amostrasRelacionadas: string[];
  fonte: 'ia' | 'mock';
}

// Sugestão gerada pela IA (ou pelo fallback mock)
export interface SugestaoIA {
  saudacao: string; // frase curta e personalizada
  conteudoId: string; // conteúdo recomendado
  motivo: string; // por que foi recomendado
  amostrasSugeridas: string[]; // nomes de amostras sugeridas
  fonte: 'ia' | 'mock';
}
