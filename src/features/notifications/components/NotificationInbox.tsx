// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { CheckCheck, MailCheck } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadMore } from '../../../components/ui/LoadMore';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/ToggleGroup';
import { useToast } from '../../../components/ui/useToast';
import { NotificationRow } from './NotificationRow';
import { useMarkAllNotificationsRead } from '../hooks/useMarkAllNotificationsRead';
import { groupByDay } from '../lib/groupByDay';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import type { NotificationItem } from '../types/notification.type';

type NotificationInboxProps = Readonly<{
  /** Every notification loaded so far, newest first. */
  items: readonly NotificationItem[];
  /** The server's total — it can exceed the unread rows loaded so far. */
  unreadCount: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}>;

const VIEW = { all: 'all', unread: 'unread' } as const;
type View = (typeof VIEW)[keyof typeof VIEW];

const COPY = LABELS.notifications;

/**
 * The notifications page's one panel: a toolbar that stays put (All / Unread, "Mark
 * all as read") over a list grouped by day. From md up the panel fills the height the
 * page gives it and the list scrolls inside, day headings sticking as they pass; on a
 * phone the page itself scrolls — hence overflow-clip there, since overflow-hidden
 * would make the card the headings' scroll container and they would never stick.
 *
 * "Unread" filters what is loaded: the API has no unread-only query, so older unread
 * rows arrive through "Load more" like any others.
 */
export function NotificationInbox({
  items,
  unreadCount,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: NotificationInboxProps): ReactElement {
  const [view, setView] = useState<View>(VIEW.all);
  const toast = useToast();
  const markAll = useMarkAllNotificationsRead();

  const loadedUnreadIds = items.filter((item) => item.readAt === null).map((item) => item.id);
  const visible = view === VIEW.unread ? items.filter((item) => item.readAt === null) : items;
  const groups = groupByDay(visible);

  function handleMarkAll(): void {
    markAll.mutate(loadedUnreadIds, {
      onSuccess: () => toast.show(COPY.markedAllReadToast(loadedUnreadIds.length), 'success'),
      onError: (err) => toast.show(getErrorMessage(err), 'error'),
    });
  }

  return (
    <Card variant="elevated" className="overflow-clip md:flex md:min-h-96 md:flex-1 md:flex-col md:overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-5">
        <ToggleGroup
          type="single"
          aria-label={COPY.viewLabel}
          value={view}
          // Radix reports '' when the pressed item is pressed again — a view can't be "none".
          onValueChange={(next: string) => {
            if (next === VIEW.all || next === VIEW.unread) setView(next);
          }}
          className="flex gap-1.5"
        >
          <ToggleGroupItem value={VIEW.all}>{COPY.filterAll}</ToggleGroupItem>
          <ToggleGroupItem value={VIEW.unread} className="group">
            {COPY.filterUnread}
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/15 px-1.5 text-xs tabular-nums group-data-[state=on]:bg-primary-foreground/20">
                {unreadCount}
              </span>
            )}
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkAll}
          isLoading={markAll.isPending}
          disabled={loadedUnreadIds.length === 0 || markAll.isPending}
        >
          {!markAll.isPending && <CheckCheck aria-hidden="true" />}
          {COPY.markAllRead}
        </Button>
      </div>

      <div className="md:min-h-0 md:flex-1 md:overflow-y-auto md:overscroll-contain">
        {groups.length === 0 ? (
          <div className="p-4 sm:p-6">
            <EmptyState
              icon={MailCheck}
              title={COPY.noUnreadTitle}
              body={hasMore ? COPY.noUnreadLoadedBody : COPY.noUnreadBody}
              action={
                <Button variant="outline" size="sm" onClick={() => setView(VIEW.all)}>
                  {COPY.showAll}
                </Button>
              }
            />
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.key} aria-label={group.label}>
              <h2 className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-muted px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-caps text-muted-foreground sm:px-5">
                {group.label}
                <span className="font-sans font-medium normal-case tracking-normal tabular-nums">{group.items.length}</span>
              </h2>
              <ul className="divide-y divide-border border-b border-border">
                {group.items.map((item) => (
                  <NotificationRow key={item.id} notification={item} />
                ))}
              </ul>
            </section>
          ))
        )}
        <LoadMore hasMore={hasMore} isLoading={isLoadingMore} onClick={onLoadMore} />
      </div>
    </Card>
  );
}
