import type { CSSProperties } from 'react';

/**
 * Particulas de luz que sobem lentamente pelo cenario escuro.
 * Posicoes pseudo-aleatorias deterministicas (sem re-render aleatorio).
 * Usar dentro de um container `relative overflow-hidden`.
 */
const PARTICULAS = Array.from({ length: 16 }, (_, i) => {
  const seed = (i * 137.5) % 100; // distribuicao tipo golden angle
  return {
    left: `${seed}%`,
    size: 2.5 + (i % 4) * 1.5, // 2.5px a 7px
    duration: 14 + ((i * 7) % 14), // 14s a 27s
    delay: -((i * 5.3) % 22), // ja em voo no primeiro frame
    opacity: 0.25 + ((i * 13) % 40) / 100, // 0.25 a 0.65
    drift: (i % 2 === 0 ? 1 : -1) * (12 + ((i * 11) % 40)), // vai e vem lateral
  };
});

export function Particles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICULAS.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--p-op': p.opacity,
              '--p-drift': `${p.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
