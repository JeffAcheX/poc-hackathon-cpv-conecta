import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { AMOSTRAS, LIMITE_AMOSTRAS } from '@/data/mockData';
import { IconBack, IconMinus, IconPlus } from '@/components/icons';

type Amostra = (typeof AMOSTRAS)[number];

export function SamplesScreen() {
  const navigate = useNavigate();
  const { medico } = useApp();
  const { showToast } = useToast();

  const [cart, setCart] = useState<Record<string, number>>({});
  const [limiteAtingido, setLimiteAtingido] = useState(false);

  const total = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart],
  );
  const disponiveis = LIMITE_AMOSTRAS - total;

  const amostras = useMemo(() => {
    return [...AMOSTRAS].sort((a, b) => {
      const aMatch = a.especialidade === medico?.especialidade ? -1 : 0;
      const bMatch = b.especialidade === medico?.especialidade ? -1 : 0;
      return aMatch - bMatch;
    });
  }, [medico]);

  function change(id: string, delta: number) {
    if (delta > 0 && total >= LIMITE_AMOSTRAS) {
      setLimiteAtingido(true);
      showToast('Limite de unidades disponíveis atingido por agora.');
      return;
    }
    setCart((prev) => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) };
      const novoTotal = Object.values(next).reduce((a, b) => a + b, 0);
      if (novoTotal < LIMITE_AMOSTRAS) setLimiteAtingido(false);
      return next;
    });
  }

  function finalizar() {
    if (total === 0) return;
    showToast(
      `${total} amostra(s) solicitada(s)! A caminho do seu consultório.`,
    );
    setCart({});
    setLimiteAtingido(false);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card"
        >
          <IconBack className="h-5 w-5 text-ink" />
        </button>
        <div>
          <h1 className="text-[17px] font-extrabold sm:text-[22px]">
            Amostras grátis
          </h1>
          <p className="hidden text-sm text-ink-sub sm:block">
            Selecione unidades liberadas para o seu consultório.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <LimitCard disponiveis={disponiveis} className="lg:hidden" />

          {limiteAtingido && (
            <LimitAlert className="lg:hidden" />
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {amostras.map((a) => (
              <SampleCard
                key={a.id}
                amostra={a}
                qtd={cart[a.id] ?? 0}
                recomendada={a.especialidade === medico?.especialidade}
                onChange={change}
              />
            ))}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-4">
            <LimitCard disponiveis={disponiveis} />
            {limiteAtingido && <LimitAlert />}
            <div className="rounded-card bg-white p-5 shadow-card">
              <div className="text-[13px] font-semibold text-ink-sub">
                Pedido atual
              </div>
              <div className="mt-1 text-[26px] font-extrabold text-ink">
                {total} {total === 1 ? 'unidade' : 'unidades'}
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-sub">
                As amostras selecionadas serão enviadas para o consultório
                cadastrado.
              </p>
              <button
                type="button"
                onClick={finalizar}
                disabled={total === 0}
                className="btn btn-primary btn-block btn-md mt-4 disabled:opacity-40"
              >
                Solicitar amostras
              </button>
            </div>
          </div>
        </aside>
      </div>

      {total > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 animate-slide-up border-t border-line bg-white p-4 pb-6 lg:hidden">
          <button
            type="button"
            onClick={finalizar}
            className="btn btn-primary btn-block btn-md"
          >
            Solicitar {total} {total === 1 ? 'amostra' : 'amostras'}
          </button>
        </div>
      )}
    </div>
  );
}

function LimitCard({
  disponiveis,
  className = '',
}: {
  disponiveis: number;
  className?: string;
}) {
  return (
    <div className={`rounded-card bg-brand p-4 text-white shadow-soft sm:p-5 ${className}`}>
      <div className="text-[13px] text-white/85">Disponíveis para você</div>
      <div className="text-[24px] font-extrabold sm:text-[28px]">
        {disponiveis} unidades
      </div>
      <p className="mt-1 text-[12.5px] leading-relaxed text-white/80">
        Seu score libera novos lotes. Continue engajado para desbloquear mais.
      </p>
    </div>
  );
}

function LimitAlert({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-800 ${className}`}>
      Você atingiu o limite atual de {LIMITE_AMOSTRAS} unidades. Ganhe mais
      pontos para liberar novas amostras.
    </div>
  );
}

function SampleCard({
  amostra,
  qtd,
  recomendada,
  onChange,
}: {
  amostra: Amostra;
  qtd: number;
  recomendada: boolean;
  onChange: (id: string, delta: number) => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-card bg-white p-4 shadow-card">
      {amostra.imagem && (
        <div className="mb-3 h-24 overflow-hidden rounded-xl bg-brand-bg">
          <img src={amostra.imagem} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="min-w-0 text-[15px] font-bold">{amostra.nome}</h3>
          {recomendada && (
            <span className="rounded-pill bg-brand-bg px-2 py-0.5 text-[10.5px] font-semibold text-brand">
              Para você
            </span>
          )}
        </div>
        <div className="text-[12px] font-medium text-brand">
          {amostra.categoria}
        </div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-sub">
          {amostra.descricao}
        </p>
      </div>

      <div className="mt-4 border-t border-line pt-3">
        <span className="text-[12px] font-semibold text-ink-sub">
          Quantidade
        </span>
        <div className="mt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onChange(amostra.id, -1)}
            disabled={qtd === 0}
            aria-label="Diminuir"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink disabled:opacity-30"
          >
            <IconMinus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center text-[15px] font-bold">{qtd}</span>
          <button
            type="button"
            onClick={() => onChange(amostra.id, 1)}
            aria-label="Aumentar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white"
          >
            <IconPlus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
