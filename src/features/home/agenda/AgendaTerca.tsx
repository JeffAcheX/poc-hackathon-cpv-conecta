import type { Conteudo } from '@/types';

export function AgendaTerca({
  conteudo,
  onVer,
}: {
  conteudo: Conteudo;
  onVer: () => void;
}) {
  return (
    <div className="rounded-xl bg-white p-3">
      <div className="flex items-center gap-3">
        <div
          className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg"
          style={{ backgroundColor: conteudo.corThumb }}
        >
          {conteudo.imagem && (
            <img src={conteudo.imagem} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase text-brand">
            {conteudo.tipo} · {conteudo.duracaoMin} min de leitura
          </div>
          <div className="truncate text-[13.5px] font-bold text-ink">
            {conteudo.titulo}
          </div>
        </div>
      </div>
      <button type="button" onClick={onVer} className="btn btn-primary btn-sm btn-block mt-3">
        Ver conteúdo
      </button>
    </div>
  );
}
