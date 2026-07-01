export function AgendaDomingo({ onCheckin }: { onCheckin: () => void }) {
  return (
    <button type="button" onClick={onCheckin} className="btn btn-primary btn-sm">
      Fazer check-in
    </button>
  );
}
