// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/Popover';
import { ArrowRight, Bell, BellOff } from 'lucide-react';
import { TextLink } from '../../../components/ui/TextLink';
import { Skeleton } from '../../../components/ui/Skeleton';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { formatRelative } from '../../../lib/datetime';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

const SKELETON_ROWS = ['a', 'b', 'c'] as const;

/**
 * Composite shared component: owns its own query (Q31 — polled every 60s, no
 * WebSockets) and its own open/close state. A Popover, not a full-height
 * Sheet — a 5-item preview list doesn't warrant taking over the viewport;
 * "View all" goes to the full cursor-paginated /notifications page.
 */
export function NotificationBell(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const query = useNotifications();

  const items = query.data?.pages[0]?.items ?? [];
  const unreadCount = query.data?.pages[0]?.unreadCount ?? 0;
  const lastUpdatedAt = query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        aria-label={LABELS.notifications.bellLabel}
        className="relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-foreground"
      >
        <Bell className="size-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-label={LABELS.notifications.unreadBadgeLabel(unreadCount)}
            className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold leading-none text-destructive-foreground ring-2 ring-card animate-in zoom-in-50 duration-300"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-display text-base font-semibold tracking-snug text-foreground">{LABELS.notifications.drawerTitle}</p>
          {unreadCount > 0 && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              {LABELS.notifications.unreadBadgeLabel(unreadCount)}
            </span>
          )}
        </div>

        <div className="max-h-[min(26rem,60dvh)] overflow-y-auto p-2">
          {query.isPending && (
            <div role="status" className="space-y-2 p-2">
              {SKELETON_ROWS.map((row) => (
                <div key={row} className="flex gap-3">
                  <Skeleton className="mt-1 size-2 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-4/5" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
              <span className="sr-only">{LABELS.chrome.loading}</span>
            </div>
          )}

          {/* A poll failure degrades to the stale data plus a "last updated" marker
              below, never a blocking error screen — unless there is no data at all yet. */}
          {query.isError && !query.data && (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground" role="status">
              {LABELS.notifications.updateFailed}
            </p>
          )}

          {query.isSuccess && items.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-2 py-8 text-center">
              <BellOff className="size-6 text-foreground-faint" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">{LABELS.notifications.drawerEmpty}</p>
            </div>
          )}

          {items.length > 0 && (
            <ul className="space-y-1">
              {items.map((item) => (
                <NotificationItem key={item.id} notification={item} onNavigate={() => setIsOpen(false)} />
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5">
          <TextLink to={ROUTES.notifications} onClick={() => setIsOpen(false)} className="group inline-flex items-center gap-1">
            {LABELS.notifications.viewAll}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </TextLink>
          {lastUpdatedAt && (
            <span className="text-xs text-muted-foreground" role={query.isError ? 'status' : undefined}>
              {query.isError ? LABELS.notifications.updateFailed : LABELS.notifications.lastUpdated(formatRelative(lastUpdatedAt))}
            </span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
