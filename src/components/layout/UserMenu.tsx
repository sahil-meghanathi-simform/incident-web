// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { useLogoutConfirm } from '../../features/auth/hooks/useLogoutConfirm';
import { ROUTES } from '../../app/routes';
import { LABELS } from '../../lib/labels';
import type { SessionUser } from '../../types/auth.type';

type UserMenuProps = Readonly<{ user: SessionUser }>;

export function UserMenu({ user }: UserMenuProps): ReactElement {
  const { requestLogout } = useLogoutConfirm();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={LABELS.chrome.userMenuLabel}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-accent"
      >
        <Avatar name={user.displayName} className="bg-primary text-primary-foreground" />
        <span className="hidden max-w-36 truncate font-medium text-foreground-soft md:inline">{user.displayName}</span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 py-2">
          <Avatar name={user.displayName} className="size-10 bg-primary text-sm text-primary-foreground" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">{user.displayName}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
          </span>
        </DropdownMenuLabel>
        <div className="flex flex-wrap gap-1.5 px-2 pb-2">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
            {LABELS.nav.roleLabel[user.role]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground-soft">
            <ShieldCheck className="size-3" aria-hidden="true" />
            {LABELS.nav.clearanceLevel(user.clearanceLevel)}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate(ROUTES.home)}>
          <LayoutDashboard className="size-4" aria-hidden="true" />
          {LABELS.nav.items.dashboard}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate(ROUTES.notifications)}>
          <Bell className="size-4" aria-hidden="true" />
          {LABELS.nav.items.notifications}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={requestLogout} destructive>
          <LogOut className="size-4" aria-hidden="true" />
          {LABELS.auth.logOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
