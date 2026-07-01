import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { sugestoesMedicamento } from '@/lib/ai';
import { IconChat, IconSend, IconSpark } from '@/components/icons';

export function AssistantHero() {
  const navigate = useNavigate();
  const { medico } = useApp();
  const sugestoes = useMemo(() => sugestoesMedicamento(medico), [medico]);

  function abrir(pergunta?: string) {
    navigate('/assistente', pergunta ? { state: { pergunta } } : undefined);
  }

  return (
    <div className="rounded-card bg-brand-deep p-5 text-white shadow-soft sm:p-6">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase text-brand-soft">
        <IconChat className="h-4 w-4" />
        Representante Digital
      </div>
      <h2 className="mt-2 text-[19px] font-extrabold leading-snug sm:text-[22px]">
        Tire uma dúvida sobre medicamentos agora
      </h2>
      <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-white/75 sm:text-sm">
        Respostas com base científica, personalizadas para a sua especialidade
        — é a visita médica quando você precisar dela.
      </p>

      {/* campo que parece input e abre o chat */}
      <button
        onClick={() => abrir()}
        className="mt-3 flex w-full items-center gap-2 rounded-pill bg-white/95 px-4 py-3 text-left text-[13.5px] text-ink-sub"
      >
        <IconSpark className="h-4 w-4 flex-shrink-0 text-brand" />
        <span className="min-w-0 flex-1 truncate">Escreva sua dúvida…</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
          <IconSend className="h-4 w-4" />
        </span>
      </button>

      <div className="mt-3 flex flex-wrap gap-2">
        {sugestoes.map((s) => (
          <button
            key={s}
            onClick={() => abrir(s)}
            className="rounded-pill bg-white/15 px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-white/25"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
