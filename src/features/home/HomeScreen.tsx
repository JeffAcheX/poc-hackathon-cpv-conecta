import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useLayout } from '@/components/AppLayout';
import { CONTEUDOS, RANKING } from '@/data/mockData';
import { gerarSugestao } from '@/lib/ai';
import type { SugestaoIA } from '@/types';
import { ScoreCard } from './ScoreCard';
import { VisitaGuiadaHero } from './VisitaGuiadaHero';
import { AssistantHero } from './AssistantHero';
import { DailyActions } from './DailyActions';
import { WeeklyAgendaCard } from './WeeklyAgendaCard';
import { IconArticle, IconCalendar, IconSpark } from '@/components/icons';

export function HomeScreen() {
  const { medico, score } = useApp();
  const { openScoreSheet } = useLayout();
  const navigate = useNavigate();
  const [sugestao, setSugestao] = useState<SugestaoIA | null>(null);

  useEffect(() => {
    if (!medico) return;
    let ativo = true;
    gerarSugestao(medico, score).then((s) => ativo && setSugestao(s));
    return () => {
      ativo = false;
    };
    // busca uma vez ao montar (perfil estavel na sessao)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const primeiroNome = medico?.nome.split(' ').slice(0, 2).join(' ') ?? 'Doutor(a)';
  const conteudoSugerido =
    CONTEUDOS.find((c) => c.id === sugestao?.conteudoId) ?? CONTEUDOS[0];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="lg:flex lg:items-end lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <h1 className="text-[22px] font-extrabold sm:text-[26px]">
            Olá, {primeiroNome}
          </h1>
          <p className="mt-1 max-w-3xl text-[13.5px] leading-relaxed text-ink-sub sm:text-sm">
            {sugestao?.saudacao ??
              'Aqui está um resumo do que preparamos para você hoje.'}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-5">
          <VisitaGuiadaHero />

          <AssistantHero />

          <div className="lg:hidden">
            <ScoreCard onOpen={openScoreSheet} />
          </div>

          <Section title="Suas ações de hoje">
            <DailyActions />
          </Section>

          <Section title="Para você">
            <div className="-mx-1 flex gap-3 overflow-x-auto px-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
              <MiniCard
                icon={<IconCalendar className="h-5 w-5 text-brand" />}
                title="Eventos"
                desc="Confira os eventos abertos e participe."
                cta="Participar"
                onClick={() => navigate('/quiz')}
              />
              <MiniCard
                icon={<IconSpark className="h-5 w-5 text-brand" />}
                title="Amostras"
                desc="Solicite amostras grátis para seu consultório."
                cta="Solicitar"
                secondary
                onClick={() => navigate('/amostras')}
              />
            </div>
          </Section>

          <Section title="Conteúdo sugerido para você">
            {sugestao?.motivo && (
              <div className="mb-2.5 flex items-start gap-2 rounded-xl bg-brand-bg px-3 py-2.5 text-[12.5px] leading-relaxed text-brand sm:text-[13px]">
                <IconSpark className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>{sugestao.motivo}</span>
              </div>
            )}
            <SuggestedContentCard
              conteudo={conteudoSugerido}
              onClick={() => navigate(`/conteudo/${conteudoSugerido.id}`)}
            />
          </Section>
        </div>

        <aside className="hidden min-w-0 space-y-5 lg:sticky lg:top-8 lg:block lg:self-start">
          <ScoreCard onOpen={openScoreSheet} />
          <WeeklyAgendaCard
            conteudoSugeridoId={conteudoSugerido.id}
            onOpenScoreSheet={openScoreSheet}
          />
          <RankingCard />
          <FeaturedEventCard onOpen={() => navigate('/conteudo/c-webinar-2026')} />
        </aside>

        <div className="min-w-0 space-y-5 lg:hidden">
          <WeeklyAgendaCard
            conteudoSugeridoId={conteudoSugerido.id}
            onOpenScoreSheet={openScoreSheet}
          />
          <RankingCard />
          <Section title="Eventos em destaque">
            <FeaturedEventCard onOpen={() => navigate('/conteudo/c-webinar-2026')} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function SuggestedContentCard({
  conteudo,
  onClick,
}: {
  conteudo: (typeof CONTEUDOS)[number];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-card bg-white text-left shadow-card transition hover:shadow-soft sm:grid sm:grid-cols-[minmax(160px,0.72fr)_1fr] lg:block xl:grid"
    >
      <div
        className="relative h-32 overflow-hidden sm:h-full sm:min-h-[172px] lg:h-36 xl:h-full"
        style={{ backgroundColor: conteudo.corThumb }}
      >
        {conteudo.imagem && (
          <img
            src={conteudo.imagem}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-pill bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink">
          <IconArticle className="h-3.5 w-3.5 text-brand" />
          {conteudo.duracaoMin} min de leitura
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="text-[11.5px] font-semibold uppercase text-brand">
          {conteudo.tipo} · {conteudo.especialidade}
        </div>
        <h4 className="mt-1 text-[15px] font-bold leading-snug sm:text-[17px]">
          {conteudo.titulo}
        </h4>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-sub sm:text-[13.5px]">
          {conteudo.resumo}
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-[12px] font-semibold text-brand">
          <IconSpark className="h-3.5 w-3.5" />
          Ganhe {conteudo.pontos} pts ao ler até o fim
        </div>
      </div>
    </button>
  );
}

function RankingCard() {
  const [tab, setTab] = useState<'esp' | 'reg'>('esp');
  return (
    <div className="rounded-card bg-white p-[18px] shadow-card">
      <div className="section-title mb-3">Como você está</div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <TabBtn active={tab === 'esp'} onClick={() => setTab('esp')}>
          Especialidade
        </TabBtn>
        <TabBtn active={tab === 'reg'} onClick={() => setTab('reg')}>
          Regional
        </TabBtn>
      </div>
      <div className="rounded-xl bg-canvas p-3 text-[13px] leading-relaxed text-ink">
        Você acertou <b>{RANKING.seuAcerto}%</b> do caso clínico desta semana. A
        média {tab === 'esp' ? 'da sua especialidade' : 'da sua região'} foi de{' '}
        <b>{RANKING.mediaEspecialidade}%</b>.
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 lg:flex-col lg:items-start xl:flex-row xl:items-center">
        <div className="w-fit rounded-pill bg-brand px-3 py-1.5 text-[13px] font-bold text-white">
          {RANKING.suaFaixa}
        </div>
        <div className="text-[12.5px] leading-tight text-ink-sub">
          Entre os mais ativos da sua {tab === 'esp' ? 'especialidade' : 'região'}
          <span className="block text-[11px]">
            Ranking anônimo e comparativo
          </span>
        </div>
      </div>
    </div>
  );
}

function FeaturedEventCard({ onOpen }: { onOpen: () => void }) {
  const evento = CONTEUDOS.find((c) => c.id === 'c-webinar-2026') ?? CONTEUDOS[0];
  return (
    <div className="overflow-hidden rounded-card bg-white shadow-card">
      <div
        className="h-28 overflow-hidden sm:h-32"
        style={{ backgroundColor: evento.corThumb }}
      >
        {evento.imagem && (
          <img src={evento.imagem} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <div className="text-[11.5px] font-semibold uppercase text-brand">
          Evento online · webinar
        </div>
        <h4 className="mt-1 text-[15px] font-bold leading-snug">{evento.titulo}</h4>
        <button type="button" onClick={onOpen} className="btn btn-primary btn-sm btn-block mt-3">
          Participar
        </button>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-pill py-2 text-[13px] font-semibold transition ${
        active ? 'bg-brand text-white' : 'bg-canvas text-ink-sub'
      }`}
    >
      {children}
    </button>
  );
}

function MiniCard({
  icon,
  title,
  desc,
  cta,
  onClick,
  secondary,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  cta: string;
  onClick: () => void;
  secondary?: boolean;
}) {
  return (
    <div className="flex w-[190px] flex-shrink-0 flex-col rounded-card bg-white p-4 shadow-card sm:w-full">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-bg">
        {icon}
      </div>
      <h3 className="text-[15px] font-bold">{title}</h3>
      <p className="mt-1 flex-1 text-[12.5px] leading-relaxed text-ink-sub">
        {desc}
      </p>
      <button
        type="button"
        onClick={onClick}
        className={`btn btn-sm btn-block mt-3 ${
          secondary ? 'btn-secondary' : 'btn-primary'
        }`}
      >
        {cta}
      </button>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="section-title mb-2.5">{title}</div>
      {children}
    </section>
  );
}
