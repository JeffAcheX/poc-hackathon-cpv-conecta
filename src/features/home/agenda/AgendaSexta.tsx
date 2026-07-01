export function AgendaSexta({
  onSeguir,
  onVerResumo,
}: {
  onSeguir: () => void;
  onVerResumo: () => void;
}) {
  return (
    <div className="rounded-xl bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white">
          CV
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-bold text-ink">
            @cuidadospelavida
          </div>
          <div className="truncate text-[12px] text-ink-sub">
            Novidades e bastidores da plataforma
          </div>
        </div>
        <button type="button" onClick={onSeguir} className="btn btn-secondary btn-sm">
          Seguir
        </button>
      </div>
      <button
        type="button"
        onClick={onVerResumo}
        className="mt-3 text-[12.5px] font-semibold text-brand"
      >
        Ver resumo da semana →
      </button>
    </div>
  );
}
