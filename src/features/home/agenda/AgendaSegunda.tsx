import { useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import type { Conteudo, Medico } from '@/types';
import { AMOSTRAS } from '@/data/mockData';
import { IconPlus } from '@/components/icons';

type Escolha = 'amostras' | 'conteudo' | 'eventos';

interface AgendaSegundaProps {
  medico: Medico | null;
  conteudoSugerido: Conteudo;
  evento: Conteudo;
  onNavigate: NavigateFunction;
  onSolicitarAmostras: (qtd: number) => void;
}

export function AgendaSegunda({
  medico,
  conteudoSugerido,
  evento,
  onNavigate,
  onSolicitarAmostras,
}: AgendaSegundaProps) {
  const [escolha, setEscolha] = useState<Escolha | null>(null);
  const [qtd, setQtd] = useState<Record<string, number>>({});

  const daEspecialidade = medico
    ? AMOSTRAS.filter((a) => a.especialidade === medico.especialidade)
    : [];
  const listaAmostras =
    daEspecialidade.length > 0
      ? daEspecialidade
      : AMOSTRAS.filter((a) => a.especialidade === 'Geral');

  const total = Object.values(qtd).reduce((a, b) => a + b, 0);

  function somar(id: string) {
    setQtd((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function solicitar() {
    onSolicitarAmostras(total);
    setQtd({});
    setEscolha(null);
  }

  if (!escolha) {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEscolha('amostras')}
          className="btn btn-primary btn-sm"
        >
          Amostras grátis
        </button>
        <button
          type="button"
          onClick={() => setEscolha('conteudo')}
          className="btn btn-secondary btn-sm"
        >
          Conteúdos científicos
        </button>
        <button
          type="button"
          onClick={() => setEscolha('eventos')}
          className="btn btn-secondary btn-sm"
        >
          Eventos
        </button>
      </div>
    );
  }

  if (escolha === 'amostras') {
    return (
      <div className="rounded-xl bg-white p-3">
        <div className="space-y-2">
          {listaAmostras.slice(0, 3).map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-ink">
                  {a.nome}
                </div>
                <div className="truncate text-[11.5px] text-ink-sub">
                  {a.categoria}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(qtd[a.id] ?? 0) > 0 && (
                  <span className="text-[13px] font-bold text-ink">{qtd[a.id]}</span>
                )}
                <button
                  type="button"
                  onClick={() => somar(a.id)}
                  aria-label={`Adicionar ${a.nome}`}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white"
                >
                  <IconPlus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={solicitar}
          disabled={total === 0}
          className="btn btn-primary btn-sm btn-block mt-3 disabled:opacity-40"
        >
          {total > 0 ? `Solicitar ${total} amostra(s)` : 'Selecione as amostras'}
        </button>
      </div>
    );
  }

  if (escolha === 'conteudo') {
    return (
      <div className="rounded-xl bg-white p-3">
        <div className="text-[11px] font-semibold uppercase text-brand">
          {conteudoSugerido.tipo} · {conteudoSugerido.duracaoMin} min de leitura
        </div>
        <div className="mt-1 text-[13.5px] font-bold text-ink">
          {conteudoSugerido.titulo}
        </div>
        <button
          type="button"
          onClick={() => onNavigate(`/conteudo/${conteudoSugerido.id}`)}
          className="btn btn-primary btn-sm mt-3"
        >
          Ver conteúdo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-3">
      <div className="text-[11px] font-semibold uppercase text-brand">
        Evento online
      </div>
      <div className="mt-1 text-[13.5px] font-bold text-ink">{evento.titulo}</div>
      <button
        type="button"
        onClick={() => onNavigate(`/conteudo/${evento.id}`)}
        className="btn btn-primary btn-sm mt-3"
      >
        Participar
      </button>
    </div>
  );
}
