// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';
import { ROUTES } from '../../app/routes';
import { LABELS } from '../../lib/labels';

type TopBarProps = Readonly<{
  onOpenPalette: () => void;
}>;

export function TopBar({ onOpenPalette }: TopBarProps): ReactElement {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/85 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-card/70 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav />
        {/* The desktop sidebar carries the brand mark; on phones it lives here. */}
        <Link
          to={ROUTES.home}
          className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-deep text-primary-foreground">
            <ShieldAlert className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate font-display text-base font-semibold tracking-snug text-foreground">
            {LABELS.nav.appShortTitle}
          </span>
        </Link>
        <button
          type="button"
          onClick={onOpenPalette}
          aria-label={LABELS.palette.triggerLabel}
          aria-keyshortcuts="Control+K Meta+K"
          className="group hidden h-9 w-72 items-center gap-2.5 rounded-lg border border-border bg-background/70 px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:border-foreground-faint hover:text-foreground-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex lg:w-80"
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 text-left">{LABELS.palette.trigger}</span>
          <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-sans text-xs font-medium text-muted-foreground">
            {LABELS.palette.shortcut}
          </kbd>
        </button>
      </div>
      {user && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label={LABELS.palette.triggerLabel}
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
          <NotificationBell />
          <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
          <UserMenu user={user} />
        </div>
      )}
    </header>
  );
}
