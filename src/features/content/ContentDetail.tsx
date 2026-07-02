import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { CONTEUDOS } from '@/data/mockData';
import { IconBack, IconCheck, IconSpark } from '@/components/icons';

type Conteudo = (typeof CONTEUDOS)[number];

export function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { conteudosLidos, registrarLeitura } = useApp();
  const { showToast } = useToast();

  const conteudo = CONTEUDOS.find((c) => c.id === id);
  if (!conteudo) {
    return (
      <div className="mx-auto w-full max-w-3xl p-6">
        <p className="text-sm text-ink-sub">Conteúdo não encontrado.</p>
        <button type="button" onClick={() => navigate('/')} className="btn btn-primary btn-sm mt-4">
          Voltar
        </button>
      </div>
    );
  }

  const conteudoAtual = conteudo;
  const jaLido = conteudosLidos.includes(conteudoAtual.id);

  function concluir() {
    const ok = registrarLeitura(conteudoAtual.id, conteudoAtual.pontos);
    if (ok) showToast(`Leitura concluída! +${conteudoAtual.pontos} pts.`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white"
        >
          <IconBack className="h-5 w-5 text-ink" />
        </button>
        <h1 className="text-[17px] font-extrabold sm:text-[22px]">Conteúdo</h1>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="min-w-0">
          <div
            className="relative flex h-40 items-end overflow-hidden rounded-card p-4 shadow-card sm:h-52 lg:h-64"
            style={{ backgroundColor: conteudoAtual.corThumb }}
          >
            {conteudoAtual.imagem && (
              <img
                src={conteudoAtual.imagem}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <span className="relative rounded-pill bg-white/90 px-3 py-1 text-[12px] font-semibold text-ink">
              {conteudoAtual.tipo} · {conteudoAtual.duracaoMin} min
            </span>
          </div>

          <div className="pt-4 lg:pt-5">
            <div className="text-[11.5px] font-semibold uppercase text-brand">
              {conteudoAtual.especialidade}
            </div>
            <h2 className="mt-1 max-w-3xl text-[19px] font-extrabold leading-snug sm:text-[26px]">
              {conteudoAtual.titulo}
            </h2>

            <div className="mt-4 max-w-3xl space-y-3 sm:mt-5">
              {conteudoAtual.corpo.map((p, i) => (
                <p key={i} className="text-[14px] leading-relaxed text-ink sm:text-[15px]">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <CompletionCard
            conteudo={conteudoAtual}
            jaLido={jaLido}
            onComplete={concluir}
            onSample={() => navigate('/amostras')}
          />
        </aside>
      </div>
    </div>
  );
}

function CompletionCard({
  conteudo,
  jaLido,
  onComplete,
  onSample,
}: {
  conteudo: Conteudo;
  jaLido: boolean;
  onComplete: () => void;
  onSample: () => void;
}) {
  return (
    <div className="rounded-card bg-white p-4 shadow-card sm:p-5">
      {jaLido ? (
        <div className="flex items-start gap-2 text-[14px] font-semibold leading-relaxed text-brandgreen">
          <IconCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            Você já concluiu este conteúdo. +{conteudo.pontos} pts creditados.
          </span>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-start gap-1.5 text-[13px] font-semibold leading-relaxed text-brand">
            <IconSpark className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Conclua a leitura para ganhar {conteudo.pontos} pts.</span>
          </div>
          <button type="button" onClick={onComplete} className="btn btn-primary btn-block btn-md">
            Marcar como concluído
          </button>
        </>
      )}

      <button
        type="button"
        onClick={onSample}
        className="btn btn-secondary btn-block btn-md mt-3"
      >
        Solicitar amostra relacionada
      </button>
    </div>
  );
}
