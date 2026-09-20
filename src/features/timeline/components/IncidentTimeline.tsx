// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { Fragment, type ReactElement } from 'react';
import { History } from 'lucide-react';
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

type DayGroup = { key: string; label: string; events: TimelineEvent[] };

const SKELETON_SLOTS = ['first', 'second', 'third'] as const;

/** Newest first, grouped by calendar day (build-plan.md, Module 8) — a divider renders
 * once per day boundary as the already-sorted list is walked, never a second sort. */
function groupByDay(events: readonly TimelineEvent[]): readonly DayGroup[] {
  const groups: DayGroup[] = [];
  for (const event of events) {
    const key = dayKey(event.occurredAt);
    const last = groups.at(-1);
    if (last?.key === key) last.events.push(event);
    else groups.push({ key, label: formatDayLabel(event.occurredAt), events: [event] });
  }
  return groups;
}

/** A vertical rail: one line down the left, an icon dot per event, day pills on top. */
export function IncidentTimeline({ incidentId }: IncidentTimelineProps): ReactElement {
  const query = useIncidentTimeline(incidentId);
  const events = query.data?.pages.flatMap((page) => page.items) ?? [];
  const hasMore = query.data?.pages.at(-1)?.hasMore ?? false;
  const groups = groupByDay(events);

  return (
    <div className="space-y-4">
      {query.isPending && (
        <div aria-busy="true" className="space-y-2.5">
          {SKELETON_SLOTS.map((slot) => (
            <SkeletonCard key={slot} variant="list-item" />
          ))}
        </div>
      )}

      {query.isError && <ErrorState message={LABELS.timeline.loadError} onRetry={() => query.refetch()} />}

      {query.isSuccess && events.length === 0 && (
        <EmptyState icon={History} title={LABELS.timeline.emptyTitle} body={LABELS.timeline.emptyBody} />
      )}

      {events.length > 0 && (
        <ol
          aria-label={LABELS.incidents.timelineView.listLabel}
          className="relative space-y-3 animate-in fade-in duration-300 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:-translate-x-1/2 before:bg-border"
        >
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
        <LoadMore
          hasMore={hasMore}
          isLoading={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
          label={LABELS.timeline.loadMore}
        />
      )}
    </div>
  );
}
