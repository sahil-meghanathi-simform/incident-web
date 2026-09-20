// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { BellRing } from 'lucide-react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { formatRelative } from '../../../lib/datetime';
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead';
import { ROUTES } from '../../../app/routes';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';
import type { NotificationItem as NotificationItemData } from '../types/notification.type';

type NotificationItemProps = Readonly<{
  notification: NotificationItemData;
  onNavigate?: () => void;
}>;

/** Clicking through marks it read — fire-and-forget, never blocks the navigation.
 * Unread is shown three ways (accent bar, weight, sr-only text), never colour alone.
 * Compact enough for the bell's 24rem popover as well as the full page. */
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
          'relative flex items-start gap-3 overflow-hidden rounded-lg border px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-accent',
          isUnread ? 'border-primary/25 bg-accent/60' : 'border-border bg-card',
        )}
      >
        {isUnread && <span className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden="true" />}
        <span
          className={cn(
            'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
            isUnread ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
          )}
        >
          <BellRing className="size-3.5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 space-y-1.5">
          <span
            className={cn(
              'block truncate text-sm',
              isUnread ? 'font-semibold text-foreground' : 'font-normal text-foreground-soft',
            )}
          >
            {isUnread && <span className="sr-only">{LABELS.notifications.unread}</span>}
            {notification.incidentTitle}
          </span>
          <span className="flex flex-wrap items-center gap-1.5">
            <SeverityBadge severity={notification.severity} />
            <EscalationBadge level={notification.level} />
          </span>
          <span className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            <span className="font-mono">{notification.incidentReference}</span>
            <span aria-hidden="true">·</span>
            <span>{formatRelative(notification.createdAt)}</span>
          </span>
        </span>
      </Link>
    </li>
  );
}
