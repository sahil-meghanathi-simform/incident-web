import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLogout } from '../../features/auth/hooks/useLogout';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { Button } from '../ui/Button';
import { ROUTES } from '../../app/routes';
import { LABELS } from '../../lib/labels';

export function TopBar(): ReactElement {
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  async function handleLogout(): Promise<void> {
    await logout.mutateAsync();
    navigate(ROUTES.login, { replace: true });
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <span className="text-sm font-semibold text-slate-900">{LABELS.nav.appTitle}</span>
      {user && (
        <div className="flex items-center gap-3">
          <NotificationBell />
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            Clearance {user.clearanceLevel}
          </span>
          <span className="text-sm text-slate-700">{user.displayName}</span>
          <Button variant="ghost" onClick={handleLogout} isLoading={logout.isPending}>
            {LABELS.auth.logOut}
          </Button>
        </div>
      )}
    </header>
  );
}
