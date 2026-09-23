// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { SideNav } from './SideNav';
import { SkipLink } from './SkipLink';
import { CommandPalette, MAIN_CONTENT_ID } from './CommandPalette';
import { TopLoadingBar } from '../feedback/TopLoadingBar';
import { ReportIncidentProvider } from '../../features/incidents/components/ReportIncidentProvider';
import { LogoutConfirmProvider } from '../../features/auth/components/LogoutConfirmProvider';
import { useHotkey } from '../../hooks/useHotkey';

export function AppShell(): ReactElement {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  useHotkey({ key: 'k' }, () => setIsPaletteOpen((open) => !open));

  return (
    // Reporting an incident is a dialog available from every screen in the shell —
    // the sidebar, the palette, the dashboard and both lists all open this one.
    // Logging out asks for confirmation first, from wherever it's triggered.
    <ReportIncidentProvider>
      <LogoutConfirmProvider>
        <div className="flex h-dvh overflow-hidden bg-background">
          <SkipLink targetId={MAIN_CONTENT_ID} />
          <TopLoadingBar />
          <SideNav />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar onOpenPalette={() => setIsPaletteOpen(true)} />
            <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 overflow-y-auto outline-none">
              <Outlet />
            </main>
          </div>
          <CommandPalette isOpen={isPaletteOpen} onOpenChange={setIsPaletteOpen} />
        </div>
      </LogoutConfirmProvider>
    </ReportIncidentProvider>
  );
}
