import type { ReactNode } from 'react';

/**
 * Casca responsiva do app.
 * - Mobile: ocupa a tela inteira para uso rapido no consultorio.
 * - Desktop: usa uma area ampla, sem prender a experiencia a um mock de celular.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full justify-center bg-[#e7e2ea] lg:p-4 xl:p-6">
      <div className="relative flex h-[100dvh] w-full max-w-[1440px] flex-col overflow-hidden bg-canvas lg:h-[calc(100dvh-2rem)] lg:rounded-[28px] lg:border lg:border-white/70 lg:shadow-xl xl:h-[calc(100dvh-3rem)]">
        {children}
      </div>
    </div>
  );
}
