import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { formatRelative } from '../../../lib/datetime';
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead';
import { ROUTES } from '../../../app/routes';
import { cn } from '../../../lib/cn';
import type { NotificationItem as NotificationItemData } from '../types/notification.type';

type NotificationItemProps = Readonly<{
  notification: NotificationItemData;
  onNavigate?: () => void;
}>;

/** Clicking through marks it read — fire-and-forget, never blocks the navigation. */
export function NotificationItem({ notification, onNavigate }: NotificationItemProps): ReactElement {
  const markRead = useMarkNotificationRead();
  const isUnread = notification.readAt === null;

  function handleClick(): void {
    if (isUnread) markRead.mutate(notification.id);
    onNavigate?.();
  }

  return (
    <li>
      <Link
        to={ROUTES.incidentDetail(notification.incidentId)}
        onClick={handleClick}
        className={cn(
          'block space-y-1 rounded-md border border-slate-200 px-3 py-2 hover:bg-slate-50',
          isUnread && 'bg-blue-50/60',
        )}
      >
        <div className="flex items-center gap-2">
          {isUnread && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />}
          <span className="truncate text-sm font-medium text-slate-900">{notification.incidentTitle}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={notification.severity} />
          <EscalationBadge level={notification.level} />
          <span className="font-mono text-xs text-slate-500">{notification.incidentReference}</span>
        </div>
        <p className="text-xs text-slate-500">{formatRelative(notification.createdAt)}</p>
      </Link>
    </li>
  );
}
