import { useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { AMOSTRAS, CONTEUDOS, QUIZZES } from '@/data/mockData';
import { IconArticle, IconCase, IconCheck, IconSample } from '@/components/icons';

export function saudacaoPorHorario(): string {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function VisitaGuiadaHero() {
  const navigate = useNavigate();
  const { medico, quizFeitos } = useApp();

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

  const concluida = quizFeitos.includes(quiz.id);
  const primeiroNome = medico?.nome.split(' ').slice(0, 2).join(' ') ?? 'Doutor(a)';

  return (
    <div className="rounded-card bg-brand-deep p-5 text-white shadow-soft sm:p-6">
      <h2 className="text-[19px] font-extrabold leading-snug sm:text-[22px]">
        {saudacaoPorHorario()}, {primeiroNome}.
      </h2>
      <p className="mt-1 text-[13px] leading-relaxed text-white/75 sm:text-sm">
        {concluida
          ? 'Você já concluiu sua visita guiada desta semana.'
          : 'Sua visita desta semana está pronta.'}
      </p>

      <div className="mt-4 space-y-2.5">
        <ChecklistItem icon={<IconCase className="h-4 w-4" />} label="Caso clínico" />
        <ChecklistItem
          icon={<IconArticle className="h-4 w-4" />}
          label={conteudo.titulo}
        />
        <ChecklistItem
          icon={<IconSample className="h-4 w-4" />}
          label={`${amostra.nome} disponível`}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium text-white/60">
          Tempo estimado: 3 minutos
        </span>
        <button
          type="button"
          onClick={() => navigate('/visita')}
          className="btn btn-sm bg-white text-brand hover:bg-white/90"
        >
          {concluida ? (
            <span className="flex items-center gap-1.5">
              <IconCheck className="h-3.5 w-3.5" />
              Ver resumo
            </span>
          ) : (
            'Iniciar Visita'
          )}
        </button>
      </div>
    </div>
  );
}

function ChecklistItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2">
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
        {icon}
      </span>
      <span className="min-w-0 truncate text-[13px] font-medium">{label}</span>
    </div>
  );
}
