import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { IconCheck, IconCheckboxTask, IconPlay, IconPlus } from '@/components/icons';

export function DailyActions() {
  const { checkinHoje, fazerCheckin } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleCheckin() {
    const ok = fazerCheckin();
    if (ok) showToast('Check-in feito! +10 pts no seu score.');
  }

  return (
    <div className="rounded-card bg-white px-4 shadow-card">
      {/* check-in */}
      <Row
        icon={
          checkinHoje ? (
            <IconCheck className="h-5 w-5 text-brandgreen" />
          ) : (
            <IconCheckboxTask className="h-5 w-5 text-brand" />
          )
        }
        iconBg={checkinHoje ? 'bg-brandgreen/10' : 'bg-brand-bg'}
        title="Check-in diário"
        sub={checkinHoje ? 'Feito hoje' : 'Ainda não feito hoje'}
        right={
          checkinHoje ? (
            <span className="text-[13px] font-bold text-brandgreen">+10 pts</span>
          ) : (
            <button
              onClick={handleCheckin}
              className="rounded-pill bg-brand px-4 py-2 text-[12.5px] font-semibold text-white"
            >
              Fazer check-in
            </button>
          )
        }
      />
      <Divider />
      <Row
        icon={<IconPlus className="h-5 w-5 text-brand" />}
        iconBg="bg-brand-bg"
        title="Caso clínico da semana"
        sub="Entenda seu perfil de indicação"
        onClick={() => navigate('/quiz')}
        right={<span className="text-[13px] font-bold text-brand">+30 pts</span>}
      />
      <Divider />
      <Row
        icon={<IconPlay className="h-5 w-5 text-brand" />}
        iconBg="bg-brand-bg"
        title="Assistir conteúdo curto"
        sub="Vídeo de 3 min sobre arritmias"
        onClick={() => navigate('/conteudo/c-cardio-arritmias')}
        right={<span className="text-[13px] font-bold text-brand">+15 pts</span>}
      />
    </div>
  );
}

function Row({
  icon,
  iconBg,
  title,
  sub,
  right,
  onClick,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  right: ReactNode;
  onClick?: () => void;
}) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`flex w-full items-center gap-3 py-3.5 text-left ${
        onClick ? 'transition active:opacity-70' : ''
      }`}
    >
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-ink">{title}</span>
        <span className="block text-[12.5px] text-ink-sub">{sub}</span>
      </span>
      <span className="ml-auto shrink-0">{right}</span>
    </Comp>
  );
}

function Divider() {
  return <div className="border-t border-line" />;
}
