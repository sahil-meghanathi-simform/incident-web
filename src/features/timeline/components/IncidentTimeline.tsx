import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadMore } from '../../../components/ui/LoadMore';
import { TimelineDayDivider } from './TimelineDayDivider';
import { TimelineEventItem } from './TimelineEventItem';
import { useIncidentTimeline } from '../hooks/useIncidentTimeline';
import { dayKey, formatDayLabel } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import type { TimelineEvent } from '../types/timeline.type';

type IncidentTimelineProps = Readonly<{
  incidentId: string;
}>;

/** Newest first, grouped by calendar day (build-plan.md, Module 8) — a divider renders
 * once per day boundary as the already-sorted list is walked, never a second sort. */
function groupByDay(events: readonly TimelineEvent[]): ReadonlyArray<{ key: string; label: string; events: TimelineEvent[] }> {
  const groups: { key: string; label: string; events: TimelineEvent[] }[] = [];
  for (const event of events) {
    const key = dayKey(event.occurredAt);
    const last = groups.at(-1);
    if (last?.key === key) last.events.push(event);
    else groups.push({ key, label: formatDayLabel(event.occurredAt), events: [event] });
  }
  return groups;
}

export function IncidentTimeline({ incidentId }: IncidentTimelineProps): ReactElement {
  const query = useIncidentTimeline(incidentId);
  const events = query.data?.pages.flatMap((page) => page.items) ?? [];
  const hasMore = query.data?.pages.at(-1)?.hasMore ?? false;
  const groups = groupByDay(events);

  return (
    <div className="space-y-4 py-4">
      {query.isPending && (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {query.isError && <ErrorState message={LABELS.timeline.loadError} onRetry={() => query.refetch()} />}

      {query.isSuccess && events.length === 0 && (
        <EmptyState title={LABELS.timeline.emptyTitle} body={LABELS.timeline.emptyBody} />
      )}

      {events.length > 0 && (
        <ol className="space-y-2">
          {groups.map((group) => (
            <Fragment key={group.key}>
              <TimelineDayDivider label={group.label} />
              {group.events.map((event) => (
                <TimelineEventItem key={event.id} event={event} />
              ))}
            </Fragment>
          ))}
        </ol>
      )}

      {query.isSuccess && (
        <LoadMore hasMore={hasMore} isLoading={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()} />
      )}
    </div>
  );
}
