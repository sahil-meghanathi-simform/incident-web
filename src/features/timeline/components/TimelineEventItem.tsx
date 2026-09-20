// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Lock, type LucideIcon } from 'lucide-react';
import { Tooltip } from '../../../components/ui/Tooltip';
import { formatDateTime, formatRelative } from '../../../lib/datetime';
import { cn } from '../../../lib/cn';
import { describeTimelineEvent } from '../timelineEventCopy';
import { TIMELINE_EVENT_VISUAL } from '../timelineEventIcon';
import { LABELS } from '../../../lib/labels';
import type { TimelineEvent } from '../types/timeline.type';

type TimelineEventItemProps = Readonly<{
  event: TimelineEvent;
}>;

function RailDot({ icon: Icon, toneClass }: { icon: LucideIcon; toneClass: string }): ReactElement {
  // The opaque backing disc hides the rail line behind a translucent tint.
  return (
    <span className="relative flex size-8 shrink-0 rounded-full bg-background">
      <span className={cn('flex size-8 items-center justify-center rounded-full ring-1', toneClass)}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
    </span>
  );
}

/**
 * A redacted NOTE_ADDED row (§8.1) renders as a muted, deliberately sparse line — no
 * actor, no timestamp tooltip content beyond "when", nothing else to reveal. Every
 * other event type goes through the shared sentence-builder.
 */
export function TimelineEventItem({ event }: TimelineEventItemProps): ReactElement {
  if (event.type === 'NOTE_ADDED' && event.redacted) {
    return (
      <li className="relative flex items-start gap-3">
        <RailDot icon={Lock} toneClass="bg-muted text-muted-foreground ring-border" />
        <p className="min-w-0 flex-1 rounded-lg border border-dashed border-border bg-muted/60 px-3.5 py-2 text-sm italic text-muted-foreground">
          {LABELS.timeline.redactedNote}
        </p>
      </li>
    );
  }

  const visual = TIMELINE_EVENT_VISUAL[event.type];
  return (
    <li className="relative flex items-start gap-3">
      <RailDot icon={visual.icon} toneClass={visual.toneClass} />
      <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-lg border border-border bg-card px-3.5 py-2 shadow-xs sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <span className="text-sm leading-relaxed text-foreground-soft">{describeTimelineEvent(event)}</span>
        <Tooltip label={LABELS.timeline.exactTimestampLabel(formatDateTime(event.occurredAt))}>
          <time
            dateTime={event.occurredAt}
            tabIndex={0}
            className="shrink-0 whitespace-nowrap rounded text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {formatRelative(event.occurredAt)}
          </time>
        </Tooltip>
      </div>
    </li>
  );
}
