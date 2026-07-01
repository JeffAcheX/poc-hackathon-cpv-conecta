import { useState } from 'react';
import type { PerguntaCasoSemanal } from '@/data/mockData';

interface AgendaQuartaProps {
  perguntas: PerguntaCasoSemanal[];
  feito: boolean;
  onEnviar: () => void;
}

export function AgendaQuarta({ perguntas, feito, onEnviar }: AgendaQuartaProps) {
  const [respostas, setRespostas] = useState<Record<number, number>>({});

  if (feito) {
    return (
      <div className="rounded-xl bg-white p-3 text-[13px] leading-relaxed text-ink-sub">
        Você já respondeu o caso clínico desta semana. Volte na próxima semana
        para um novo.
      </div>
    );
  }

  const todasRespondidas = perguntas.every((_, i) => respostas[i] !== undefined);

  return (
    <div className="space-y-3 rounded-xl bg-white p-3">
      {perguntas.map((p, i) => (
        <div key={i}>
          <div className="text-[13px] font-semibold text-ink">{p.pergunta}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {p.opcoes.map((op, j) => (
              <button
                key={op}
                type="button"
                onClick={() => setRespostas((prev) => ({ ...prev, [i]: j }))}
                className={`rounded-pill border px-3 py-1.5 text-[12px] font-medium transition ${
                  respostas[i] === j
                    ? 'border-brand bg-brand-bg text-brand'
                    : 'border-line text-ink-sub'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onEnviar}
        disabled={!todasRespondidas}
        className="btn btn-primary btn-sm btn-block disabled:opacity-40"
      >
        Enviar respostas
      </button>
    </div>
  );
}
