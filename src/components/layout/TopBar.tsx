// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLogout } from '../../features/auth/hooks/useLogout';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { MobileNav } from './MobileNav';
import { Avatar } from '../ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
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
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        <MobileNav />
        <span className="font-display text-base font-semibold tracking-snug text-foreground">{LABELS.nav.appTitle}</span>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={LABELS.chrome.userMenuLabel}
              className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar name={user.displayName} />
              <span className="hidden text-foreground-soft sm:inline">{user.displayName}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <span className="block truncate">{user.displayName}</span>
                <span className="block text-xs font-normal text-muted-foreground">Clearance {user.clearanceLevel}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => void handleLogout()} destructive>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {LABELS.auth.logOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}
