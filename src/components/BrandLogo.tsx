import cpvLogoUrl from '../../logo-cpv-new@3x.webp';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <img
      src={cpvLogoUrl}
      alt="Cuidados Pela Vida"
      className={`block max-w-full object-contain ${className}`}
    />
  );
}
