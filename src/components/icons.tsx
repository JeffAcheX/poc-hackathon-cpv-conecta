import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export const IconHome = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
  </svg>
);

export const IconSample = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2v6m0 0a6 6 0 016 6v6H6v-6a6 6 0 016-6z" />
  </svg>
);

export const IconCalendar = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </svg>
);

export const IconCase = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4v16m8-8H4" />
  </svg>
);

export const IconTrophy = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="7" />
    <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
  </svg>
);

export const IconHelp = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const IconCheckboxTask = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);

export const IconPlay = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const IconArticle = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M16 3l-4 4-4-4" />
  </svg>
);

export const IconSpark = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2l2.2 5.6L20 9l-5.8 2L12 17l-2.2-6L4 9l5.8-1.4L12 2z" />
  </svg>
);

export const IconQuestion = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 015 .5c0 1.5-2 2-2 3.5" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </svg>
);

export const IconBack = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconUser = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

export const IconInfo = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const IconSend = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

export const IconFlame = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3c1 3 4 4.5 4 8a4 4 0 11-8 0c0-1.5.8-2.5 1.5-3.2C10 9 11.5 6 12 3z" />
  </svg>
);

export const IconUsers = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20c0-3.4 2.9-5.5 6.5-5.5s6.5 2.1 6.5 5.5" />
    <path d="M15.5 5.2a3.2 3.2 0 010 6" />
    <path d="M17.5 14.7c2.6.5 4 2.2 4 5.3" />
  </svg>
);

export const IconTrendUp = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 17l6-6 4 4 7-8" />
    <path d="M15 7h5v5" />
  </svg>
);

export const IconLock = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

export const IconChat = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
