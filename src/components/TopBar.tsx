import { BrandLogo } from '@/components/BrandLogo';

interface TopBarProps {
  onMenu: () => void;
}

export function TopBar({ onMenu }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-3.5">
          <button
            aria-label="Abrir menu"
            onClick={onMenu}
            className="flex h-[18px] w-6 flex-col justify-between"
          >
            <span className="block h-0.5 rounded bg-ink" />
            <span className="block h-0.5 rounded bg-ink" />
            <span className="block h-0.5 rounded bg-ink" />
          </button>
          <BrandLogo className="h-[24px] sm:h-[26px]" />
        </div>
      </div>
    </header>
  );
}
