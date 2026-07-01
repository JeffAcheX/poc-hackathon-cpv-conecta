import { useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import { BrandLogo } from '@/components/BrandLogo';
import type { Papel } from '@/types';
import {
  IconCalendar,
  IconCase,
  IconChat,
  IconHelp,
  IconHome,
  IconSample,
  IconTrophy,
  IconUser,
  IconUsers,
} from '@/components/icons';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  icon: ReactNode;
  label: string;
  path?: string;
  activePath?: string;
}

const NAV_GROUPS_MEDICO: NavItem[][] = [
  [
    { icon: <IconHome />, label: 'Início', path: '/', activePath: '/' },
    {
      icon: <IconChat />,
      label: 'Representante Digital',
      path: '/assistente',
      activePath: '/assistente',
    },
    {
      icon: <IconSample />,
      label: 'Amostras grátis',
      path: '/amostras',
      activePath: '/amostras',
    },
  ],
  [
    { icon: <IconCalendar />, label: 'Eventos', path: '/' },
    {
      icon: <IconCase />,
      label: 'Caso clínico da semana',
      path: '/quiz',
      activePath: '/quiz',
    },
    { icon: <IconTrophy />, label: 'Ranking', path: '/' },
  ],
  [{ icon: <IconHelp />, label: 'Ajuda' }],
];

const NAV_GROUPS_REPRESENTANTE: NavItem[][] = [
  [
    {
      icon: <IconUsers />,
      label: 'Carteira de médicos',
      path: '/',
      activePath: '/',
    },
  ],
  [{ icon: <IconHelp />, label: 'Ajuda' }],
];

function navGroupsFor(papel: Papel | undefined): NavItem[][] {
  return papel === 'representante' ? NAV_GROUPS_REPRESENTANTE : NAV_GROUPS_MEDICO;
}

export function DesktopSidebar() {
  const { medico, logout } = useApp();
  const navigate = useNavigate();

  return (
    <aside className="hidden w-[292px] shrink-0 flex-col border-r border-line bg-white lg:flex">
      <div className="border-b border-line px-6 py-6">
        <div className="flex min-w-0 flex-col items-start gap-1.5">
          <BrandLogo className="h-[26px]" />
          <div className="text-xs font-medium text-ink-sub">
            {medico?.papel === 'representante' ? 'Portal do Representante' : 'Portal do Médico'}
          </div>
        </div>

        <div className="mt-6 rounded-card bg-canvas p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-bg text-brand">
              <IconUser className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[14px] font-bold text-ink">
                {medico?.nome ?? 'Médico'}
              </div>
              <div className="truncate text-[12px] text-ink-sub">
                {medico?.papel === 'representante'
                  ? `Representante · ${medico.uf}`
                  : `CRM ${medico?.crm}-${medico?.uf} · ${medico?.especialidade}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavList
        onNavigate={(path) => navigate(path)}
        variant="desktop"
        papel={medico?.papel}
      />

      <button
        type="button"
        onClick={logout}
        className="border-t border-line px-6 py-4 text-left text-sm font-semibold text-ink-sub transition hover:text-brand"
      >
        Sair
      </button>
    </aside>
  );
}

export function Drawer({ open, onClose }: DrawerProps) {
  const { medico, logout } = useApp();
  const navigate = useNavigate();

  function go(path: string) {
    navigate(path);
    onClose();
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute inset-0 z-[70] bg-black/40 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        style={{ transform: open ? 'translateX(0)' : 'translateX(-100%)' }}
        className="absolute inset-y-0 left-0 z-[71] flex w-[min(84vw,320px)] flex-col bg-white shadow-xl transition-transform duration-300 lg:hidden"
      >
        <div className="bg-brand px-5 py-5 text-white">
          <div className="mb-5 w-fit max-w-full rounded-2xl bg-white px-3 py-2 shadow-soft">
            <BrandLogo className="h-[22px]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">
              <IconUser className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold">
                {medico?.nome ?? 'Médico'}
              </div>
              <div className="truncate text-xs text-white/80">
                {medico?.papel === 'representante'
                  ? `Representante · ${medico.uf}`
                  : `CRM ${medico?.crm}-${medico?.uf} · ${medico?.especialidade}`}
              </div>
            </div>
          </div>
        </div>

        <NavList
          onNavigate={go}
          onClose={onClose}
          variant="mobile"
          papel={medico?.papel}
        />

        <button
          type="button"
          onClick={() => {
            logout();
            onClose();
          }}
          className="border-t border-line px-6 py-4 text-left text-sm font-semibold text-ink-sub hover:text-brand"
        >
          Sair
        </button>
      </aside>
    </>
  );
}

function NavList({
  onNavigate,
  onClose,
  variant,
  papel,
}: {
  onNavigate: (path: string) => void;
  onClose?: () => void;
  variant: 'mobile' | 'desktop';
  papel: Papel | undefined;
}) {
  const { pathname } = useLocation();
  const groups = navGroupsFor(papel);

  return (
    <nav className="flex-1 overflow-y-auto p-3">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {groupIndex > 0 && <div className="my-2 border-t border-line" />}
          {group.map((item) => (
            <NavButton
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={isActive(pathname, item)}
              variant={variant}
              onClick={() => {
                if (item.path) onNavigate(item.path);
                else onClose?.();
              }}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}

function NavButton({
  icon,
  label,
  active,
  variant,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  variant: 'mobile' | 'desktop';
  onClick: () => void;
}) {
  const activeClass = active
    ? 'bg-brand-bg text-brand'
    : 'text-ink hover:bg-brand-bg hover:text-brand';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium transition ${activeClass} ${
        variant === 'desktop' ? 'text-[14px]' : 'text-[14.5px]'
      }`}
    >
      <span className="h-5 w-5 shrink-0 text-brand">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}

function isActive(pathname: string, item: NavItem) {
  if (!item.activePath) return false;
  if (item.activePath === '/') return pathname === '/';
  return pathname.startsWith(item.activePath);
}
