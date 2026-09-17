import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { SideNav } from './SideNav';

export function AppShell(): ReactElement {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        {/* Explicit bg-slate-50: every page/feature component in this UI kit is
            light-mode-only (bg-white cards, text-slate-900 headings, etc.), matching
            TopBar/SideNav's own explicit bg-white — without this, <main> inherits the
            dark theme's body background and every such heading becomes dark-on-dark
            and effectively invisible (found via browser verification in Module 3). */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
