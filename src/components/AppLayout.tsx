import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { TopBar } from '@/components/TopBar';
import { DesktopSidebar, Drawer } from '@/components/Drawer';
import { ScoreSheet } from '@/components/ScoreSheet';

interface LayoutContext {
  openScoreSheet: () => void;
}

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // rola para o topo ao trocar de rota
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  const ctx: LayoutContext = { openScoreSheet: () => setSheetOpen(true) };

  return (
    <AppShell>
      <div className="flex min-h-0 flex-1">
        <DesktopSidebar />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <TopBar onMenu={() => setDrawerOpen(true)} />
          <div ref={scrollRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div
              key={location.pathname}
              className="aurora-light animate-page-in flex min-h-full flex-col"
            >
              <Outlet context={ctx} />
            </div>
          </div>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          <ScoreSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
        </div>
      </div>
    </AppShell>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLayout() {
  return useOutletContext<LayoutContext>();
}
