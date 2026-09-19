import type { ReactElement } from 'react';
import { Tooltip } from '../../../components/ui/Tooltip';
import { formatDateTime, formatRelative } from '../../../lib/datetime';
import { describeTimelineEvent } from '../timelineEventCopy';
import { LABELS } from '../../../lib/labels';
import type { TimelineEvent } from '../types/timeline.type';

type TimelineEventItemProps = Readonly<{
  event: TimelineEvent;
}>;

/**
 * A redacted NOTE_ADDED row (§8.1) renders as a muted, deliberately sparse line — no
 * actor, no timestamp tooltip content beyond "when", nothing else to reveal. Every
 * other event type goes through the shared sentence-builder.
 */
export function TimelineEventItem({ event }: TimelineEventItemProps): ReactElement {
  if (event.type === 'NOTE_ADDED' && event.redacted) {
    return (
      <li className="rounded-md border border-border bg-muted px-3 py-2 text-sm italic text-muted-foreground">
        {LABELS.timeline.redactedNote}
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-baseline justify-between gap-2 rounded-md border border-border bg-card px-3 py-2">
      <span className="text-sm text-foreground-soft">{describeTimelineEvent(event)}</span>
      <Tooltip label={LABELS.timeline.exactTimestampLabel(formatDateTime(event.occurredAt))}>
        <span className="whitespace-nowrap text-xs text-muted-foreground">{formatRelative(event.occurredAt)}</span>
      </Tooltip>
    </li>
  );
}
