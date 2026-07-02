import { useApp } from '@/context/AppContext';
import { IconFlame, IconInfo } from '@/components/icons';

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function ScoreCard({ onOpen }: { onOpen: () => void }) {
  const { score, metaScore, streak } = useApp();
  const pct = Math.min(100, Math.round((score / metaScore) * 100));
  const faltam = Math.max(0, metaScore - score);
  const hojeIdx = (new Date().getDay() + 6) % 7; // seg=0

  return (
    <button
      onClick={onOpen}
      className="relative w-full overflow-hidden rounded-card p-5 text-left text-white shadow-glow-sm transition hover:shadow-glow active:scale-[0.99] sm:p-6 lg:p-5 xl:p-6"
      style={{
        backgroundImage:
          'linear-gradient(130deg, #5C3078 0%, #7A44A0 55%, #8C5FA8 100%)',
        backgroundSize: '180% 180%',
      }}
    >
      <div className="orb -right-12 -top-16 h-44 w-44 animate-pulse-glow bg-white/20" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[13px] font-medium text-white/80">
            Sua pontuação
          </div>
          <div className="text-[27px] font-extrabold leading-tight sm:text-[30px] lg:text-[27px] xl:text-[30px]">
            {score} pts
          </div>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 rounded-pill bg-white/15 px-3 py-1.5 text-[12px] font-semibold">
            <IconFlame className="h-3.5 w-3.5" />
            {streak} {streak === 1 ? 'dia' : 'dias'} seguidos
          </div>
        )}
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[12px] text-white/85">
        <span>
          {score} / {metaScore} pts
        </span>
        <span>Faltam {faltam} pts para +10 amostras</span>
      </div>

      <div className="mt-4 grid grid-cols-6 gap-1">
        {DIAS.map((d, i) => (
          <span
            key={d}
            className={`flex h-7 min-w-0 items-center justify-center rounded-lg text-[11px] font-semibold ${
              i === hojeIdx ? 'bg-white text-brand' : 'text-white/70'
            }`}
          >
            {d}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[11.5px] text-white/80">
        <IconInfo className="h-3.5 w-3.5" />
        Toque para ver como sua pontuação é calculada
      </div>
    </button>
  );
}
