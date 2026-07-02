import { useMemo, useState, type ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { REP_LEADS } from '@/data/mockData';
import type { CanalSugerido, IntencaoLead, RepLead } from '@/types';
import { IconCheck, IconTrendUp, IconUsers } from '@/components/icons';
import medicalDashboardImg from '@/assets/illustrations/medical-dashboard.png';

const CANAL_LABEL: Record<CanalSugerido, string> = {
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  visita: 'Visita',
};

const INTENCAO_CLASSE: Record<IntencaoLead, string> = {
  Alto: 'bg-brand text-white',
  Médio: 'bg-amber-100 text-amber-800',
  Baixo: 'bg-canvas text-ink-sub',
};

export function RepDashboardScreen() {
  const { medico } = useApp();
  const { showToast } = useToast();
  const [preparadas, setPreparadas] = useState<Record<string, boolean>>({});

  const primeiroNome = medico?.nome.split(' ').slice(0, 2).join(' ') ?? 'Representante';

  const kpis = useMemo(() => {
    const altaPrioridade = REP_LEADS.filter((l) => l.intencao === 'Alto').length;
    const coberturaDigital = Math.round(
      REP_LEADS.reduce((acc, l) => acc + l.engajamento, 0) / REP_LEADS.length,
    );
    return { altaPrioridade, coberturaDigital, visitasPoupadas: 24 };
  }, []);

  function prepararAcao(lead: RepLead) {
    if (preparadas[lead.id]) return;
    setPreparadas((prev) => ({ ...prev, [lead.id]: true }));
    showToast(`Ação preparada para ${lead.nome} via ${CANAL_LABEL[lead.canalSugerido]}.`);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="aurora-deep relative overflow-clip rounded-card text-white shadow-glow-sm">
        <div className="orb -right-16 -top-20 h-56 w-56 animate-pulse-glow bg-brand-soft/50" />
        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-brand-soft">
              Carteira de médicos
            </div>
            <h1 className="mt-1 text-[22px] font-extrabold sm:text-[26px]">
              Olá, {primeiroNome}
            </h1>
            <p className="mt-1 max-w-md text-[13.5px] leading-relaxed text-white/75">
              Priorize quem está mais pronto para uma ação hoje, com base no
              engajamento digital de cada médico.
            </p>
          </div>
          <img
            src={medicalDashboardImg}
            alt=""
            className="h-32 w-full animate-float rounded-2xl object-cover shadow-glow-sm sm:h-28 sm:w-48"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <KpiCard
          icon={<IconUsers className="h-5 w-5" />}
          label="Alta prioridade"
          value={String(kpis.altaPrioridade)}
          hint="médicos com intenção alta"
        />
        <KpiCard
          icon={<IconTrendUp className="h-5 w-5" />}
          label="Cobertura digital"
          value={`${kpis.coberturaDigital}%`}
          hint="engajamento médio da carteira"
        />
        <KpiCard
          icon={<IconCheck className="h-5 w-5" />}
          label="Visitas poupadas"
          value={String(kpis.visitasPoupadas)}
          hint="no mês, via visita digital"
        />
      </div>

      <div className="mt-6">
        <div className="section-title mb-3">Médicos da carteira</div>
        <div className="grid gap-3 lg:grid-cols-2">
          {REP_LEADS.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              preparada={Boolean(preparadas[lead.id])}
              onPreparar={() => prepararAcao(lead)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-bg text-brand">
        {icon}
      </div>
      <div className="mt-3 text-[26px] font-extrabold leading-tight text-ink">
        {value}
      </div>
      <div className="text-[13px] font-semibold text-ink">{label}</div>
      <div className="text-[12px] text-ink-sub">{hint}</div>
    </div>
  );
}

function LeadCard({
  lead,
  preparada,
  onPreparar,
}: {
  lead: RepLead;
  preparada: boolean;
  onPreparar: () => void;
}) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold">{lead.nome}</h3>
          <div className="text-[12.5px] text-ink-sub">
            {lead.especialidade} · {lead.uf}
          </div>
        </div>
        <span
          className={`rounded-pill px-2.5 py-1 text-[11px] font-semibold ${INTENCAO_CLASSE[lead.intencao]}`}
        >
          Intenção {lead.intencao}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11.5px] font-semibold text-ink-sub">
          <span>Engajamento digital</span>
          <span>{lead.engajamento}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${lead.engajamento}%` }}
          />
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-ink">
        {lead.proximaAcao}
      </p>
      <div className="mt-1 text-[12px] text-ink-sub">
        Último sinal: {lead.ultimoSinal}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
        <span className="rounded-pill bg-brand-bg px-2.5 py-1 text-[11.5px] font-semibold text-brand">
          Canal sugerido: {CANAL_LABEL[lead.canalSugerido]}
        </span>
        <button
          type="button"
          onClick={onPreparar}
          disabled={preparada}
          className="btn btn-primary btn-sm disabled:opacity-60"
        >
          {preparada ? (
            <span className="flex items-center gap-1.5">
              <IconCheck className="h-4 w-4" /> Preparada
            </span>
          ) : (
            'Preparar ação'
          )}
        </button>
      </div>
    </div>
  );
}
