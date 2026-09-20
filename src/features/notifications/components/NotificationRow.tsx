// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { BellRing, Check, ChevronRight } from 'lucide-react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { Tooltip } from '../../../components/ui/Tooltip';
import { formatDateTime, formatRelative } from '../../../lib/datetime';
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead';
import { ROUTES } from '../../../app/routes';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';
import type { NotificationItem as NotificationItemData } from '../types/notification.type';

type NotificationRowProps = Readonly<{
  notification: NotificationItemData;
}>;

const COPY = LABELS.notifications;

/**
 * One row of the full-page inbox. The bell's popover keeps the compact, self-bordered
 * NotificationItem; this is the roomier sibling for a divided list — and unlike it,
 * can be marked read without opening the incident.
 *
 * That second action is why the row isn't simply wrapped in a link (a button can't
 * nest inside an <a>): the title is the link and stretches over the whole row with
 * `after:inset-0`, and the button sits above that layer with `relative z-10`. The
 * link's accessible name stays just the title. Unread is shown three ways — accent
 * bar, weight, sr-only text — never colour alone.
 */
export function NotificationRow({ notification }: NotificationRowProps): ReactElement {
  const markRead = useMarkNotificationRead();
  const isUnread = notification.readAt === null;

  return (
    <li
      className={cn(
        'group relative flex items-start gap-3.5 px-4 py-3.5 transition-colors hover:bg-accent/70 focus-within:bg-accent/70 sm:px-5',
        isUnread && 'bg-accent/40',
      )}
    >
      {isUnread && <span className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden="true" />}

      <span
        className={cn(
          'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ring-1',
          isUnread ? 'bg-primary text-primary-foreground ring-primary' : 'bg-muted text-muted-foreground ring-border',
        )}
      >
        <BellRing className="size-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1 space-y-1.5">
        <Link
          to={ROUTES.incidentDetail(notification.incidentId)}
          // Fire-and-forget: marking read never blocks the navigation.
          onClick={() => isUnread && markRead.mutate(notification.id)}
          className={cn(
            "block text-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring sm:truncate",
            isUnread ? 'font-semibold text-foreground' : 'text-foreground-soft',
          )}
        >
          {isUnread && <span className="sr-only">{COPY.unread}</span>}
          {notification.incidentTitle}
        </Link>
        <div className="flex flex-wrap items-center gap-1.5">
          <SeverityBadge severity={notification.severity} />
          <EscalationBadge level={notification.level} />
        </div>
        <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          <span className="font-mono">{notification.incidentReference}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={notification.createdAt} title={formatDateTime(notification.createdAt)}>
            {formatRelative(notification.createdAt)}
          </time>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 self-center">
        {isUnread && (
          <Tooltip label={COPY.markRead} side="left">
            <button
              type="button"
              onClick={() => markRead.mutate(notification.id)}
              aria-label={COPY.markReadFor(notification.incidentReference)}
              className="relative z-10 inline-flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-xs transition-colors hover:border-primary/40 hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Check className="size-4" aria-hidden="true" />
            </button>
          </Tooltip>
        )}
        <ChevronRight
          className="size-4 text-foreground-faint transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-muted-foreground max-sm:hidden"
          aria-hidden="true"
        />
      </div>
    </li>
  );
}
