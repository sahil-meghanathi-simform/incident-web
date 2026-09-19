import { useState, type ReactElement } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../../components/ui/Sheet';
import { Bell, Loader2 } from 'lucide-react';
import { TextLink } from '../../../components/ui/TextLink';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { formatRelative } from '../../../lib/datetime';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

/**
 * Composite shared component: owns its own query (Q31 — polled every 60s, no
 * WebSockets) and its own open/close state. Renders the latest page in a Drawer;
 * "View all" goes to the full cursor-paginated /notifications page.
 */
export function NotificationBell(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const query = useNotifications();

  const items = query.data?.pages[0]?.items ?? [];
  const unreadCount = query.data?.pages[0]?.unreadCount ?? 0;
  const lastUpdatedAt = query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={LABELS.notifications.bellLabel}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-label={LABELS.notifications.unreadBadgeLabel(unreadCount)}
            className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{LABELS.notifications.drawerTitle}</SheetTitle>
          </SheetHeader>
          {query.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}

          {/* A poll failure degrades to the stale data plus a "last updated" marker
              below, never a blocking error screen — unless there is no data at all yet. */}
          {query.isError && !query.data && (
            <p className="text-sm text-muted-foreground" role="status">
              {LABELS.notifications.updateFailed}
            </p>
          )}

          {query.isSuccess && items.length === 0 && (
            <p className="text-sm text-muted-foreground">{LABELS.notifications.drawerEmpty}</p>
          )}

          {items.length > 0 && (
            <ul className="space-y-2">
              {items.map((item) => (
                <NotificationItem key={item.id} notification={item} onNavigate={() => setIsOpen(false)} />
              ))}
            </ul>
          )}

          <div className="mt-4 flex items-center justify-between">
            <TextLink to={ROUTES.notifications} onClick={() => setIsOpen(false)}>
              {LABELS.notifications.viewAll}
            </TextLink>
            {lastUpdatedAt && (
              <span className="text-xs text-muted-foreground" role={query.isError ? 'status' : undefined}>
                {query.isError ? LABELS.notifications.updateFailed : LABELS.notifications.lastUpdated(formatRelative(lastUpdatedAt))}
              </span>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
