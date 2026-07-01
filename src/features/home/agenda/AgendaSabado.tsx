import type { Conteudo } from '@/types';

interface AgendaSabadoProps {
  conteudo: Conteudo;
  evento: Conteudo;
  onVerConteudo: () => void;
  onVerEvento: () => void;
}

export function AgendaSabado({
  conteudo,
  evento,
  onVerConteudo,
  onVerEvento,
}: AgendaSabadoProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <ExclusiveCard
        tipo="Conteúdo"
        titulo={conteudo.titulo}
        cor={conteudo.corThumb}
        imagem={conteudo.imagem}
        cta="Ver conteúdo"
        onClick={onVerConteudo}
      />
      <ExclusiveCard
        tipo="Evento"
        titulo={evento.titulo}
        cor={evento.corThumb}
        imagem={evento.imagem}
        cta="Participar"
        onClick={onVerEvento}
      />
    </div>
  );
}

function ExclusiveCard({
  tipo,
  titulo,
  cor,
  imagem,
  cta,
  onClick,
}: {
  tipo: string;
  titulo: string;
  cor: string;
  imagem?: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <div className="relative h-16" style={{ backgroundColor: cor }}>
        {imagem && <img src={imagem} alt="" className="h-full w-full object-cover" />}
        <span className="absolute left-1.5 top-1.5 rounded-pill bg-white/90 px-1.5 py-0.5 text-[9.5px] font-semibold text-brand">
          Exclusivo
        </span>
      </div>
      <div className="p-2">
        <div className="text-[10.5px] font-semibold uppercase text-brand">{tipo}</div>
        <div className="line-clamp-2 text-[11.5px] font-bold leading-snug text-ink">
          {titulo}
        </div>
        <button
          type="button"
          onClick={onClick}
          className="btn btn-primary btn-block mt-1.5 py-1.5 text-[11px]"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
