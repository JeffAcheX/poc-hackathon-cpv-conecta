import { useApp } from '@/context/AppContext';
import { IconClose } from '@/components/icons';

interface ScoreSheetProps {
  open: boolean;
  onClose: () => void;
}

const LABELS: Record<string, string> = {
  checkin: 'Check-in diário',
  leitura: 'Leitura de conteúdo',
  quiz: 'Quiz respondido',
  video: 'Vídeo assistido',
  webinar: 'Participação em webinar',
  'caso-clinico': 'Caso clínico',
  pergunta: 'Consulta ao Representante Digital',
};

export function ScoreSheet({ open, onClose }: ScoreSheetProps) {
  const { score, eventos, metaScore } = useApp();
  const recentes = eventos.slice(0, 6);
  const panelState = open
    ? 'translate-y-0 opacity-100'
    : 'pointer-events-none translate-y-full opacity-0 lg:translate-y-8';

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-[72] max-h-[82dvh] overflow-y-auto rounded-t-[24px] bg-white p-6 shadow-sheet transition duration-300 lg:inset-x-auto lg:bottom-8 lg:right-8 lg:w-[420px] lg:rounded-card ${panelState}`}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-5 top-5 text-ink"
        >
          <IconClose className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-extrabold">Seu score: {score} pts</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-sub">
          É a soma de tudo que você fez na plataforma. Ele não é um jogo — é o
          que abre seus próximos benefícios, como novas amostras.
        </p>

        <div className="mt-5 text-[13px] font-bold uppercase text-ink-sub">
          Como você ganhou pontos
        </div>
        <div className="mt-2 space-y-1">
          {recentes.length === 0 && (
            <p className="py-3 text-[13px] text-ink-sub">
              Suas ações de hoje aparecerão aqui. Comece pelo check-in diário.
            </p>
          )}
          {recentes.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between border-b border-line py-2.5 last:border-0"
            >
              <div>
                <div className="text-[14px] font-semibold text-ink">
                  {LABELS[ev.tipo] ?? ev.descricao}
                </div>
                <div className="text-xs text-ink-sub">
                  {new Date(ev.data).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <span className="text-[14px] font-bold text-brandgreen">
                +{ev.pontos} pts
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-card bg-brand-bg p-4 text-[13px] leading-relaxed text-brand">
          Faltam <b>{Math.max(0, metaScore - score)} pts</b> para você liberar o
          próximo lote de amostras. Cada ação conta.
        </div>
      </div>
    </>
  );
}
