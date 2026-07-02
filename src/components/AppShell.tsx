import { useEffect, useState, type ReactNode } from 'react';
import { IconSpark } from '@/components/icons';

/**
 * Casca responsiva do app.
 * - Mobile: ocupa a tela inteira para uso rapido no consultorio.
 * - Desktop: superficie clara flutuando sobre um fundo etereo de auroras roxas.
 * - Modo apresentacao (botao ✦): intensifica as animacoes para o pitch.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [apresentacao, setApresentacao] = useState(() =>
    document.body.classList.contains('presentation'),
  );

  useEffect(() => {
    document.body.classList.toggle('presentation', apresentacao);
  }, [apresentacao]);

  return (
    <div className="aurora-deep relative flex min-h-[100dvh] w-full justify-center overflow-clip lg:p-4 xl:p-6">
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
      <div className="relative flex h-[100dvh] w-full max-w-[1440px] flex-col overflow-clip bg-canvas lg:h-[calc(100dvh-2rem)] lg:rounded-[28px] lg:border lg:border-white/40 lg:shadow-glow xl:h-[calc(100dvh-3rem)]">
        {children}
      </div>

      <button
        type="button"
        onClick={() => setApresentacao((v) => !v)}
        title={
          apresentacao ? 'Desativar modo apresentação' : 'Ativar modo apresentação'
        }
        aria-pressed={apresentacao}
        className={`glass-dark fixed bottom-4 right-4 z-[90] flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:scale-110 ${
          apresentacao ? 'shadow-glow-sm ring-1 ring-white/40' : 'opacity-60 hover:opacity-100'
        }`}
      >
        <IconSpark className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
