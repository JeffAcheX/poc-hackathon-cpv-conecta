import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { CASO_CLINICO_SEMANAL, CONTEUDOS, WEEKLY_AGENDA } from '@/data/mockData';
import { IconCalendar, IconCheck, IconLock } from '@/components/icons';
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

const DIA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function isoDe(data: Date): string {
  return data.toISOString().slice(0, 10);
}

function diasDaSemanaAtual(): { dow: number; iso: string }[] {
  const hoje = new Date();
  const inicio = new Date(hoje);
  inicio.setDate(hoje.getDate() - hoje.getDay());
  return Array.from({ length: 7 }, (_, dow) => {
    const data = new Date(inicio);
    data.setDate(inicio.getDate() + dow);
    return { dow, iso: isoDe(data) };
  });
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
    diasConcluidos,
    marcarDiaConcluido,
  } = useApp();
  const { showToast } = useToast();

  const hojeISO = useMemo(() => isoDe(new Date()), []);
  const semana = useMemo(() => diasDaSemanaAtual(), []);
  const diaSemanaHoje = new Date().getDay();
  const [dowSelecionado, setDowSelecionado] = useState(diaSemanaHoje);

  const diaInfo = semana[dowSelecionado];
  const dia = WEEKLY_AGENDA[dowSelecionado];
  const ehHoje = diaInfo.iso === hojeISO;
  const ehFuturo = diaInfo.iso > hojeISO;
  const concluido = diasConcluidos.includes(diaInfo.iso);
  const expirado = !ehHoje && !ehFuturo && !concluido;

  const conteudoSugerido =
    CONTEUDOS.find((c) => c.id === conteudoSugeridoId) ?? CONTEUDOS[0];
  const evento = CONTEUDOS.find((c) => c.id === 'c-webinar-2026') ?? CONTEUDOS[0];
  const perguntasSemanais =
    CASO_CLINICO_SEMANAL[medico?.especialidade ?? 'Geral'] ??
    CASO_CLINICO_SEMANAL.Geral;

  function handleCheckin() {
    const ok = fazerCheckin();
    if (ok) {
      marcarDiaConcluido(hojeISO);
      showToast('Check-in feito! +10 pts no seu score.');
    }
  }

  function handleSolicitarAmostras(qtd: number) {
    if (qtd === 0) return;
    marcarDiaConcluido(hojeISO);
    showToast(`${qtd} amostra(s) solicitada(s)! A caminho do seu consultório.`);
  }

  function handleEnviarCasoClinico() {
    const ok = registrarCasoClinicoSemanal(30);
    if (ok) {
      marcarDiaConcluido(hojeISO);
      showToast('Respostas enviadas! +30 pts no seu score.');
    }
  }

  function navegarEConcluir(path: string) {
    marcarDiaConcluido(hojeISO);
    navigate(path);
  }

  return (
    <div className="rounded-card bg-brand-bg p-4 sm:p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white">
          <IconCalendar className="h-4 w-4 text-brand" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
          {semana.map(({ dow, iso }) => {
            const ehHojeTab = iso === hojeISO;
            const futuroTab = iso > hojeISO;
            const concluidoTab = diasConcluidos.includes(iso);
            const expiradoTab = !ehHojeTab && !futuroTab && !concluidoTab;
            const selecionado = dow === dowSelecionado;

            return (
              <button
                key={dow}
                type="button"
                onClick={() => setDowSelecionado(dow)}
                aria-current={selecionado}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold transition ${
                  selecionado
                    ? 'bg-white text-brand shadow-sm'
                    : 'text-ink-sub hover:bg-white/60'
                }`}
              >
                <span
                  className={
                    concluidoTab
                      ? 'text-brand'
                      : futuroTab
                        ? 'text-ink-sub/50'
                        : expiradoTab
                          ? 'text-ink-sub/40'
                          : ehHojeTab
                            ? 'text-brand'
                            : 'text-ink-sub'
                  }
                >
                  {concluidoTab ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : futuroTab ? (
                    <IconLock className="h-3.5 w-3.5" />
                  ) : (
                    <span
                      className={`block h-1.5 w-1.5 rounded-full ${
                        ehHojeTab ? 'bg-brand' : 'bg-ink-sub/30'
                      }`}
                    />
                  )}
                </span>
                {DIA_ABREV[dow]}
              </button>
            );
          })}
        </div>
      </div>

      <h3 className="mt-3 text-[14.5px] font-bold">{dia.tema}</h3>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-sub">
        {dia.mensagem}
      </p>

      <div className="mt-3">
        {ehFuturo && (
          <div className="rounded-xl bg-white/60 p-3 text-[12.5px] leading-relaxed text-ink-sub">
            <div className="mb-1 flex items-center gap-1.5 font-semibold text-ink">
              <IconLock className="h-3.5 w-3.5" />
              Disponível em breve
            </div>
            Essa atividade libera quando o dia chegar.
          </div>
        )}

        {expirado && (
          <div className="rounded-xl bg-white/60 p-3 text-[12.5px] leading-relaxed text-ink-sub">
            Você não concluiu essa atividade a tempo — ela expirou.
          </div>
        )}

        {!ehFuturo && !expirado && concluido && (
          <div className="flex items-center gap-2 rounded-xl bg-white p-3 text-[12.5px] font-semibold text-ink">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <IconCheck className="h-3.5 w-3.5" />
            </span>
            {ehHoje ? 'Você já concluiu essa atividade hoje.' : 'Atividade concluída.'}
          </div>
        )}

        {ehHoje && !concluido && (
          <>
            {dowSelecionado === 0 && <AgendaDomingo onCheckin={handleCheckin} />}
            {dowSelecionado === 1 && (
              <AgendaSegunda
                medico={medico}
                conteudoSugerido={conteudoSugerido}
                evento={evento}
                onNavigate={navegarEConcluir}
                onSolicitarAmostras={handleSolicitarAmostras}
              />
            )}
            {dowSelecionado === 2 && (
              <AgendaTerca
                conteudo={conteudoSugerido}
                onVer={() => navegarEConcluir(`/conteudo/${conteudoSugerido.id}`)}
              />
            )}
            {dowSelecionado === 3 && (
              <AgendaQuarta
                perguntas={perguntasSemanais}
                feito={casoClinicoFeitoNestaSemana}
                onEnviar={handleEnviarCasoClinico}
              />
            )}
            {dowSelecionado === 4 && (
              <AgendaQuinta onIniciar={() => navegarEConcluir('/quiz')} />
            )}
            {dowSelecionado === 5 && (
              <AgendaSexta
                onSeguir={() => {
                  marcarDiaConcluido(hojeISO);
                  showToast(
                    'Você está acompanhando as novidades da Cuidados Pela Vida!',
                  );
                }}
                onVerResumo={onOpenScoreSheet}
              />
            )}
            {dowSelecionado === 6 && (
              <AgendaSabado
                conteudo={conteudoSugerido}
                evento={evento}
                onVerConteudo={() =>
                  navegarEConcluir(`/conteudo/${conteudoSugerido.id}`)
                }
                onVerEvento={() => navegarEConcluir(`/conteudo/${evento.id}`)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
