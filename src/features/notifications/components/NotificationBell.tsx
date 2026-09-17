import { useState, type ReactElement } from 'react';
import { Drawer } from '../../../components/ui/Drawer';
import { Spinner } from '../../../components/ui/Spinner';
import { TextLink } from '../../../components/ui/TextLink';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { formatRelative } from '../../../lib/datetime';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

const BELL_PATH =
  'M12 2a6 6 0 0 0-6 6v3.586l-1.707 1.707A1 1 0 0 0 5 15h14a1 1 0 0 0 .707-1.707L18 11.586V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z';

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
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
          <path d={BELL_PATH} />
        </svg>
        {unreadCount > 0 && (
          <span
            aria-label={LABELS.notifications.unreadBadgeLabel(unreadCount)}
            className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title={LABELS.notifications.drawerTitle}>
        {query.isPending && <Spinner className="h-4 w-4" />}

        {/* A poll failure degrades to the stale data plus a "last updated" marker
            below, never a blocking error screen — unless there is no data at all yet. */}
        {query.isError && !query.data && (
          <p className="text-sm text-slate-500" role="status">
            {LABELS.notifications.updateFailed}
          </p>
        )}

        {query.isSuccess && items.length === 0 && <p className="text-sm text-slate-500">{LABELS.notifications.drawerEmpty}</p>}

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
            <span className="text-xs text-slate-400" role={query.isError ? 'status' : undefined}>
              {query.isError ? LABELS.notifications.updateFailed : LABELS.notifications.lastUpdated(formatRelative(lastUpdatedAt))}
            </span>
          )}
        </div>
      </Drawer>
    </>
  );
}
