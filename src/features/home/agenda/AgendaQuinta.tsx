export function AgendaQuinta({ onIniciar }: { onIniciar: () => void }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <div className="text-[13.5px] font-bold text-ink">Quiz da semana</div>
      <p className="mt-1 text-[12.5px] text-ink-sub">
        Uma pergunta rápida que conecta um conteúdo a uma amostra.
      </p>
      <button type="button" onClick={onIniciar} className="btn btn-primary btn-sm mt-3">
        Realizar quiz
      </button>
    </div>
  );
}
