import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { AMOSTRAS, CONTEUDOS, QUIZZES } from '@/data/mockData';
import { saudacaoPorHorario } from '@/features/home/VisitaGuiadaHero';
import {
  IconArticle,
  IconBack,
  IconCheck,
  IconClose,
  IconSample,
} from '@/components/icons';

type Etapa = 'intro' | 'caso' | 'resultado';

export function VisitaGuiadaScreen() {
  const navigate = useNavigate();
  const { medico, quizFeitos, registrarQuiz, marcarDiaConcluido } = useApp();
  const { showToast } = useToast();

  const quiz = useMemo(
    () => QUIZZES.find((q) => q.especialidade === medico?.especialidade) ?? QUIZZES[0],
    [medico],
  );
  const conteudo = useMemo(
    () =>
      CONTEUDOS.find((c) => c.especialidade === quiz.especialidade) ?? CONTEUDOS[0],
    [quiz],
  );
  const amostra = useMemo(
    () => AMOSTRAS.find((a) => a.especialidade === quiz.especialidade) ?? AMOSTRAS[0],
    [quiz],
  );

  const jaFeito = quizFeitos.includes(quiz.id);
  const [etapa, setEtapa] = useState<Etapa>(jaFeito ? 'resultado' : 'intro');
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [respondido, setRespondido] = useState(jaFeito);

  const primeiroNome = medico?.nome.split(' ').slice(0, 2).join(' ') ?? 'Doutor(a)';
  const acertou = selecionada === quiz.respostaCorreta;

  function confirmar() {
    if (selecionada === null) return;
    setRespondido(true);
    setEtapa('resultado');
    if (selecionada === quiz.respostaCorreta) {
      const creditou = registrarQuiz(quiz.id, quiz.pontos);
      if (creditou) {
        marcarDiaConcluido(new Date().toISOString().slice(0, 10));
        showToast(`Resposta correta! +${quiz.pontos} pts.`);
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-10 pt-4 sm:px-6">
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Voltar"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card"
      >
        <IconBack className="h-5 w-5 text-ink" />
      </button>

      <div className="mt-4 rounded-card bg-brand-deep p-5 text-white shadow-soft sm:p-6">
        <ChatBubble>
          <h2 className="text-[17px] font-extrabold leading-snug sm:text-[19px]">
            {saudacaoPorHorario()}, {primeiroNome}.
          </h2>
          <p className="mt-1 text-[13.5px] leading-relaxed text-white/75">
            Sua visita desta semana está pronta.
          </p>
          <ul className="mt-3 space-y-1.5 text-[13px] text-white/85">
            <li>· Caso clínico</li>
            <li>· {conteudo.titulo}</li>
            <li>· {amostra.nome} disponível</li>
          </ul>
          <p className="mt-3 text-[12px] font-medium text-white/60">
            Tempo estimado: 3 minutos
          </p>
          {etapa === 'intro' && (
            <button
              type="button"
              onClick={() => setEtapa('caso')}
              className="btn btn-sm btn-block mt-4 bg-white text-brand hover:bg-white/90"
            >
              Iniciar Visita
            </button>
          )}
        </ChatBubble>

        {etapa !== 'intro' && (
          <ChatBubble className="mt-4">
            <div className="text-[11px] font-semibold uppercase text-brand-soft">
              Caso clínico da semana
            </div>
            <h3 className="mt-1.5 text-[15px] font-bold leading-snug">
              {quiz.pergunta}
            </h3>
            <div className="mt-3 space-y-2">
              {quiz.opcoes.map((op, i) => {
                const letra = String.fromCharCode(65 + i);
                const isSel = selecionada === i;
                const isCorreta = i === quiz.respostaCorreta;
                let estilo = 'border-white/20 bg-white/5 text-white';
                if (respondido) {
                  if (isCorreta) estilo = 'border-brandgreen bg-brandgreen/20 text-white';
                  else if (isSel) estilo = 'border-red-300 bg-red-400/15 text-white';
                  else estilo = 'border-white/10 bg-white/5 text-white/60';
                } else if (isSel) {
                  estilo = 'border-white bg-white/15 text-white';
                }
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={respondido}
                    onClick={() => setSelecionada(i)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[13.5px] leading-snug transition ${estilo}`}
                  >
                    <span className="min-w-0">
                      <b className="mr-1.5">{letra})</b>
                      {op}
                    </span>
                    {respondido && isCorreta && (
                      <IconCheck className="h-4 w-4 shrink-0 text-brandgreen" />
                    )}
                    {respondido && isSel && !isCorreta && (
                      <IconClose className="h-4 w-4 shrink-0 text-red-300" />
                    )}
                  </button>
                );
              })}
            </div>
            {!respondido && (
              <button
                type="button"
                onClick={confirmar}
                disabled={selecionada === null}
                className="btn btn-sm btn-block mt-4 bg-white text-brand hover:bg-white/90 disabled:opacity-40"
              >
                Confirmar resposta
              </button>
            )}
          </ChatBubble>
        )}

        {etapa === 'resultado' && (
          <ChatBubble className="mt-4">
            <div className="flex items-center gap-2 text-[14px] font-bold">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-brand">
                <IconCheck className="h-3.5 w-3.5" />
              </span>
              {jaFeito || acertou ? 'Excelente' : 'Quase lá'}, {primeiroNome}.
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-white/80">
              {quiz.explicacao}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/80">
              Além da conduta correta, separei um conteúdo científico
              relacionado e as amostras disponíveis para esse cenário.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(`/conteudo/${conteudo.id}`)}
                className="btn btn-sm bg-white text-brand hover:bg-white/90"
              >
                <IconArticle className="h-4 w-4" />
                Ver conteúdo
              </button>
              <button
                type="button"
                onClick={() => navigate('/amostras')}
                className="btn btn-sm border border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <IconSample className="h-4 w-4" />
                Solicitar amostras
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-sm btn-block mt-3 bg-transparent text-white/70 hover:text-white"
            >
              Finalizar visita
            </button>
          </ChatBubble>
        )}
      </div>
    </div>
  );
}

function ChatBubble({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl bg-white/10 p-4 ${className}`}>{children}</div>
  );
}
