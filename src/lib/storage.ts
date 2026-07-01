// Persistência simples em localStorage, com namespace do app.

const PREFIX = 'cpv:'; // Cuidados Pela Vida

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage cheio ou indisponível — silencioso no MVP
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}

export const STORAGE_KEYS = {
  medico: 'medico',
  score: 'score',
  eventos: 'eventos',
  checkinData: 'checkin-data',
  perguntaData: 'pergunta-data',
  casoClinicoSemana: 'caso-clinico-semana',
  quizFeitos: 'quiz-feitos',
  conteudosLidos: 'conteudos-lidos',
  amostrasSolicitadas: 'amostras-solicitadas',
  diasConcluidos: 'dias-concluidos',
} as const;
