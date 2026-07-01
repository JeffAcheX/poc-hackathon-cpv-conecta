import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { QUIZZES } from '@/data/mockData';
import { IconBack, IconCheck, IconClose, IconQuestion } from '@/components/icons';

export function QuizScreen() {
  const navigate = useNavigate();
  const { medico, quizFeitos, registrarQuiz } = useApp();
  const { showToast } = useToast();

  const quiz = useMemo(() => {
    const daEsp = QUIZZES.find((q) => q.especialidade === medico?.especialidade);
    return daEsp ?? QUIZZES[0];
  }, [medico]);

  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [respondido, setRespondido] = useState(false);
  const jaFeito = quizFeitos.includes(quiz.id);

  function confirmar() {
    if (selecionada === null) return;
    setRespondido(true);
    if (selecionada === quiz.respostaCorreta) {
      const creditou = registrarQuiz(quiz.id, quiz.pontos);
      if (creditou) showToast(`Resposta correta! +${quiz.pontos} pts.`);
    }
  }

  const acertou = selecionada === quiz.respostaCorreta;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card"
        >
          <IconBack className="h-5 w-5 text-ink" />
        </button>
        <h1 className="text-[17px] font-extrabold sm:text-[22px]">
          Caso clínico da semana
        </h1>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-card bg-white p-5 shadow-card sm:p-6">
          <div className="text-[11.5px] font-semibold uppercase text-brand">
            {quiz.especialidade} · {quiz.pontos} pts
          </div>
          <h2 className="mt-2 text-[16px] font-bold leading-snug sm:text-[19px]">
            {quiz.pergunta}
          </h2>

          <div className="mt-4 space-y-2.5">
            {quiz.opcoes.map((op, i) => {
              const isSel = selecionada === i;
              const isCorreta = i === quiz.respostaCorreta;
              let estilo = 'border-line bg-white text-ink';
              if (respondido) {
                if (isCorreta) estilo = 'border-brandgreen bg-brandgreen/10 text-ink';
                else if (isSel) estilo = 'border-red-400 bg-red-50 text-ink';
                else estilo = 'border-line bg-white text-ink-sub';
              } else if (isSel) {
                estilo = 'border-brand bg-brand-bg text-ink';
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={respondido || jaFeito}
                  onClick={() => setSelecionada(i)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[14px] leading-snug transition ${estilo}`}
                >
                  <span className="min-w-0">{op}</span>
                  {respondido && isCorreta && (
                    <IconCheck className="h-5 w-5 shrink-0 text-brandgreen" />
                  )}
                  {respondido && isSel && !isCorreta && (
                    <IconClose className="h-5 w-5 shrink-0 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {jaFeito && !respondido && (
            <div className="mt-4 rounded-xl bg-canvas p-3 text-[13px] leading-relaxed text-ink-sub">
              Você já respondeu este quiz. Confira a explicação abaixo.
            </div>
          )}

          {(respondido || jaFeito) && (
            <div
              className={`mt-4 rounded-xl p-4 text-[13px] leading-relaxed ${
                jaFeito || acertou
                  ? 'bg-brandgreen/10 text-ink'
                  : 'bg-red-50 text-ink'
              }`}
            >
              <b>
                {jaFeito
                  ? 'Explicação'
                  : acertou
                    ? 'Correto!'
                    : 'Quase lá.'}
              </b>{' '}
              {quiz.explicacao}
            </div>
          )}

          {!respondido && !jaFeito && (
            <button
              type="button"
              onClick={confirmar}
              disabled={selecionada === null}
              className="btn btn-primary btn-block btn-md mt-5 disabled:opacity-40"
            >
              Confirmar resposta
            </button>
          )}

          {(respondido || jaFeito) && (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary btn-block btn-md mt-5"
            >
              Voltar ao início
            </button>
          )}
        </div>

        <aside className="rounded-card bg-brand-bg p-5 lg:sticky lg:top-8 lg:self-start">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
            <IconQuestion className="h-6 w-6 text-brand" />
          </div>
          <div className="mt-4 text-[13px] font-semibold text-brand">
            Caso da especialidade
          </div>
          <div className="mt-1 text-[22px] font-extrabold text-ink">
            +{quiz.pontos} pts
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-sub">
            A pontuação deste caso ajuda a liberar benefícios e novas amostras
            no seu perfil.
          </p>
        </aside>
      </div>
    </div>
  );
}
