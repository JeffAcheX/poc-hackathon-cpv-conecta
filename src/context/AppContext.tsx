import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AcaoTipo, EventoScore, Medico } from '@/types';
import { load, remove, save, STORAGE_KEYS } from '@/lib/storage';
import { META_SCORE } from '@/data/mockData';

interface AppState {
  medico: Medico | null;
  score: number;
  eventos: EventoScore[];
  checkinHoje: boolean;
  quizFeitos: string[];
  conteudosLidos: string[];
  streak: number;
  casoClinicoFeitoNestaSemana: boolean;
  diasConcluidos: string[];
}

interface AppContextValue extends AppState {
  metaScore: number;
  login: (medico: Medico) => void;
  logout: () => void;
  fazerCheckin: () => boolean;
  registrarPergunta: () => boolean;
  registrarQuiz: (quizId: string, pontos: number) => boolean;
  registrarLeitura: (conteudoId: string, pontos: number) => boolean;
  registrarCasoClinicoSemanal: (pontos: number) => boolean;
  registrarAcao: (tipo: AcaoTipo, descricao: string, pontos: number) => void;
  marcarDiaConcluido: (dataISO: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// segunda-feira da semana corrente, usada como chave para ações "1x por semana"
function inicioDaSemanaISO(): string {
  const d = new Date();
  const dia = d.getDay(); // 0=domingo..6=sábado
  const diffParaSegunda = dia === 0 ? -6 : 1 - dia;
  const segunda = new Date(d);
  segunda.setDate(d.getDate() + diffParaSegunda);
  return segunda.toISOString().slice(0, 10);
}

// calcula sequência de dias consecutivos com pelo menos um evento
function calcularStreak(eventos: EventoScore[]): number {
  const dias = new Set(eventos.map((e) => e.data.slice(0, 10)));
  let streak = 0;
  const d = new Date();
  // permite que "hoje" ainda não tenha evento sem zerar a sequência
  if (!dias.has(d.toISOString().slice(0, 10))) {
    d.setDate(d.getDate() - 1);
  }
  while (dias.has(d.toISOString().slice(0, 10))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [medico, setMedico] = useState<Medico | null>(() =>
    load<Medico | null>(STORAGE_KEYS.medico, null),
  );
  const [score, setScore] = useState<number>(() =>
    load<number>(STORAGE_KEYS.score, 320),
  );
  const [eventos, setEventos] = useState<EventoScore[]>(() =>
    load<EventoScore[]>(STORAGE_KEYS.eventos, []),
  );
  const [checkinData, setCheckinData] = useState<string>(() =>
    load<string>(STORAGE_KEYS.checkinData, ''),
  );
  const [perguntaData, setPerguntaData] = useState<string>(() =>
    load<string>(STORAGE_KEYS.perguntaData, ''),
  );
  const [quizFeitos, setQuizFeitos] = useState<string[]>(() =>
    load<string[]>(STORAGE_KEYS.quizFeitos, []),
  );
  const [conteudosLidos, setConteudosLidos] = useState<string[]>(() =>
    load<string[]>(STORAGE_KEYS.conteudosLidos, []),
  );
  const [casoClinicoSemanaData, setCasoClinicoSemanaData] = useState<string>(() =>
    load<string>(STORAGE_KEYS.casoClinicoSemana, ''),
  );
  const [diasConcluidos, setDiasConcluidos] = useState<string[]>(() =>
    load<string[]>(STORAGE_KEYS.diasConcluidos, []),
  );

  // persistência
  useEffect(() => save(STORAGE_KEYS.medico, medico), [medico]);
  useEffect(() => save(STORAGE_KEYS.score, score), [score]);
  useEffect(() => save(STORAGE_KEYS.eventos, eventos), [eventos]);
  useEffect(() => save(STORAGE_KEYS.checkinData, checkinData), [checkinData]);
  useEffect(() => save(STORAGE_KEYS.perguntaData, perguntaData), [perguntaData]);
  useEffect(() => save(STORAGE_KEYS.quizFeitos, quizFeitos), [quizFeitos]);
  useEffect(
    () => save(STORAGE_KEYS.conteudosLidos, conteudosLidos),
    [conteudosLidos],
  );
  useEffect(
    () => save(STORAGE_KEYS.casoClinicoSemana, casoClinicoSemanaData),
    [casoClinicoSemanaData],
  );
  useEffect(
    () => save(STORAGE_KEYS.diasConcluidos, diasConcluidos),
    [diasConcluidos],
  );

  const addEvento = useCallback(
    (tipo: AcaoTipo, descricao: string, pontos: number) => {
      const ev: EventoScore = {
        id: `${tipo}-${Date.now()}`,
        tipo,
        descricao,
        pontos,
        data: new Date().toISOString(),
      };
      setEventos((prev) => [ev, ...prev]);
      setScore((prev) => prev + pontos);
    },
    [],
  );

  const login = useCallback((m: Medico) => setMedico(m), []);

  const logout = useCallback(() => {
    setMedico(null);
    remove(STORAGE_KEYS.medico);
  }, []);

  const fazerCheckin = useCallback((): boolean => {
    if (checkinData === hojeISO()) return false;
    setCheckinData(hojeISO());
    addEvento('checkin', 'Check-in diário', 10);
    return true;
  }, [checkinData, addEvento]);

  const registrarPergunta = useCallback((): boolean => {
    // pontua a primeira interação com o Representante Digital a cada dia
    if (perguntaData === hojeISO()) return false;
    setPerguntaData(hojeISO());
    addEvento('pergunta', 'Consulta ao Representante Digital', 10);
    return true;
  }, [perguntaData, addEvento]);

  const registrarQuiz = useCallback(
    (quizId: string, pontos: number): boolean => {
      if (quizFeitos.includes(quizId)) return false;
      setQuizFeitos((prev) => [...prev, quizId]);
      addEvento('quiz', 'Quiz respondido', pontos);
      return true;
    },
    [quizFeitos, addEvento],
  );

  const registrarLeitura = useCallback(
    (conteudoId: string, pontos: number): boolean => {
      if (conteudosLidos.includes(conteudoId)) return false;
      setConteudosLidos((prev) => [...prev, conteudoId]);
      addEvento('leitura', 'Conteúdo lido', pontos);
      return true;
    },
    [conteudosLidos, addEvento],
  );

  const registrarCasoClinicoSemanal = useCallback(
    (pontos: number): boolean => {
      if (casoClinicoSemanaData === inicioDaSemanaISO()) return false;
      setCasoClinicoSemanaData(inicioDaSemanaISO());
      addEvento('caso-clinico', 'Caso clínico da semana respondido', pontos);
      return true;
    },
    [casoClinicoSemanaData, addEvento],
  );

  const marcarDiaConcluido = useCallback((dataISO: string) => {
    setDiasConcluidos((prev) => (prev.includes(dataISO) ? prev : [...prev, dataISO]));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      medico,
      score,
      eventos,
      quizFeitos,
      conteudosLidos,
      checkinHoje: checkinData === hojeISO(),
      streak: calcularStreak(eventos),
      casoClinicoFeitoNestaSemana: casoClinicoSemanaData === inicioDaSemanaISO(),
      diasConcluidos,
      metaScore: META_SCORE,
      login,
      logout,
      fazerCheckin,
      registrarPergunta,
      registrarQuiz,
      registrarLeitura,
      registrarCasoClinicoSemanal,
      registrarAcao: addEvento,
      marcarDiaConcluido,
    }),
    [
      medico,
      score,
      eventos,
      quizFeitos,
      conteudosLidos,
      checkinData,
      casoClinicoSemanaData,
      diasConcluidos,
      login,
      logout,
      fazerCheckin,
      registrarPergunta,
      registrarQuiz,
      registrarLeitura,
      registrarCasoClinicoSemanal,
      addEvento,
      marcarDiaConcluido,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de <AppProvider>');
  return ctx;
}
