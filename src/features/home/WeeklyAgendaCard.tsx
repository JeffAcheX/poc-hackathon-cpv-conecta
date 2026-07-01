import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { CASO_CLINICO_SEMANAL, CONTEUDOS, WEEKLY_AGENDA } from '@/data/mockData';
import { IconCalendar } from '@/components/icons';
import { AgendaDomingo } from './agenda/AgendaDomingo';
import { AgendaSegunda } from './agenda/AgendaSegunda';
import { AgendaTerca } from './agenda/AgendaTerca';
import { AgendaQuarta } from './agenda/AgendaQuarta';
import { AgendaQuinta } from './agenda/AgendaQuinta';
import { AgendaSexta } from './agenda/AgendaSexta';
import { AgendaSabado } from './agenda/AgendaSabado';

interface WeeklyAgendaCardProps {
  conteudoSugeridoId: string;
  onOpenScoreSheet: () => void;
}

export function WeeklyAgendaCard({
  conteudoSugeridoId,
  onOpenScoreSheet,
}: WeeklyAgendaCardProps) {
  const navigate = useNavigate();
  const {
    medico,
    fazerCheckin,
    registrarCasoClinicoSemanal,
    casoClinicoFeitoNestaSemana,
  } = useApp();
  const { showToast } = useToast();

  const diaSemana = new Date().getDay();
  const dia = WEEKLY_AGENDA[diaSemana];
  const conteudoSugerido =
    CONTEUDOS.find((c) => c.id === conteudoSugeridoId) ?? CONTEUDOS[0];
  const evento = CONTEUDOS.find((c) => c.id === 'c-webinar-2026') ?? CONTEUDOS[0];
  const perguntasSemanais =
    CASO_CLINICO_SEMANAL[medico?.especialidade ?? 'Geral'] ??
    CASO_CLINICO_SEMANAL.Geral;

  function handleCheckin() {
    const ok = fazerCheckin();
    if (ok) showToast('Check-in feito! +10 pts no seu score.');
  }

  function handleSolicitarAmostras(qtd: number) {
    if (qtd === 0) return;
    showToast(`${qtd} amostra(s) solicitada(s)! A caminho do seu consultório.`);
  }

  function handleEnviarCasoClinico() {
    const ok = registrarCasoClinicoSemanal(30);
    if (ok) showToast('Respostas enviadas! +30 pts no seu score.');
  }

  return (
    <div className="rounded-card bg-brand-bg p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white">
          <IconCalendar className="h-6 w-6 text-brand" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14.5px] font-bold">{dia.tema}</h3>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-sub">
            {dia.mensagem}
          </p>

          <div className="mt-3">
            {diaSemana === 0 && <AgendaDomingo onCheckin={handleCheckin} />}
            {diaSemana === 1 && (
              <AgendaSegunda
                medico={medico}
                conteudoSugerido={conteudoSugerido}
                evento={evento}
                onNavigate={navigate}
                onSolicitarAmostras={handleSolicitarAmostras}
              />
            )}
            {diaSemana === 2 && (
              <AgendaTerca
                conteudo={conteudoSugerido}
                onVer={() => navigate(`/conteudo/${conteudoSugerido.id}`)}
              />
            )}
            {diaSemana === 3 && (
              <AgendaQuarta
                perguntas={perguntasSemanais}
                feito={casoClinicoFeitoNestaSemana}
                onEnviar={handleEnviarCasoClinico}
              />
            )}
            {diaSemana === 4 && (
              <AgendaQuinta onIniciar={() => navigate('/quiz')} />
            )}
            {diaSemana === 5 && (
              <AgendaSexta
                onSeguir={() =>
                  showToast('Você está acompanhando as novidades da Cuidados Pela Vida!')
                }
                onVerResumo={onOpenScoreSheet}
              />
            )}
            {diaSemana === 6 && (
              <AgendaSabado
                conteudo={conteudoSugerido}
                evento={evento}
                onVerConteudo={() => navigate(`/conteudo/${conteudoSugerido.id}`)}
                onVerEvento={() => navigate(`/conteudo/${evento.id}`)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
