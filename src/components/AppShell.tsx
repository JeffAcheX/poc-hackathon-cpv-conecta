import type { ReactNode } from 'react';

/**
 * Casca responsiva do app.
 * - Mobile: ocupa a tela inteira para uso rapido no consultorio.
 * - Desktop: superficie clara flutuando sobre um fundo etereo de auroras roxas.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="aurora-deep relative flex min-h-[100dvh] w-full justify-center overflow-hidden lg:p-4 xl:p-6">
      {/* orbes oniricos que derivam lentamente atras da superficie */}
      <div className="orb -left-32 top-[-10%] hidden h-[420px] w-[420px] animate-drift bg-brand-soft/40 lg:block" />
      <div
        className="orb -right-24 bottom-[-15%] hidden h-[480px] w-[480px] animate-drift bg-brand/50 lg:block"
        style={{ animationDelay: '-9s' }}
      />
      <div
        className="orb left-[38%] top-[55%] hidden h-72 w-72 animate-drift bg-brand-bg/20 lg:block"
        style={{ animationDelay: '-4s' }}
      />
      <div className="relative flex h-[100dvh] w-full max-w-[1440px] flex-col overflow-hidden bg-canvas lg:h-[calc(100dvh-2rem)] lg:rounded-[28px] lg:border lg:border-white/40 lg:shadow-glow xl:h-[calc(100dvh-3rem)]">
        {children}
      </div>
    </div>
  );
}
