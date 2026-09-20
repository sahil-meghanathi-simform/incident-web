// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { AlertTriangle, BellRing, CircleCheck } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { formatDateTime } from '../../../lib/datetime';
import { useIncidentEscalationEvents } from '../hooks/useIncidentEscalationEvents';
import { LABELS } from '../../../lib/labels';

type EscalationHistoryPanelProps = Readonly<{
  incidentId: string;
}>;

const SKELETON_ROWS = ['a', 'b'] as const;

/**
 * The tier-by-tier record behind the Overview tab's escalation summary field —
 * TRIAGE_MANAGER/ADMIN only, same population as the `escalation` field itself
 * (§8.1). The caller only renders this once it already knows that field is present.
 * Kept compact: it sits inside the overview's details card.
 */
export function EscalationHistoryPanel({ incidentId }: EscalationHistoryPanelProps): ReactElement {
  const query = useIncidentEscalationEvents(incidentId, true);

  if (query.isPending) {
    return (
      <div role="status" className="space-y-3">
        {SKELETON_ROWS.map((row) => (
          <div key={row} className="flex items-center gap-2.5">
            <Skeleton className="size-6 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
        <span className="sr-only">{LABELS.escalations.historyLoading}</span>
      </div>
    );
  }

  if (query.isError) {
    return (
      <p role="alert" className="flex items-center gap-1.5 text-xs text-destructive">
        <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
        {LABELS.escalations.historyLoadError}
      </p>
    );
  }

  if (query.data.events.length === 0) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CircleCheck className="size-3.5 shrink-0" aria-hidden="true" />
        {LABELS.escalations.historyEmpty}
      </p>
    );
  }

  return (
    <ol className="relative space-y-3 before:absolute before:inset-y-3 before:left-3 before:w-px before:bg-border before:content-['']">
      {query.data.events.map((event) => (
        <li key={event.id} className="relative flex items-start gap-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-escalation-l1-surface text-escalation-l1 ring-2 ring-card">
            <BellRing className="size-3" aria-hidden="true" />
          </span>
          <div className="min-w-0 pt-0.5 text-xs">
            <p className="font-medium text-foreground">{LABELS.escalations.dueLabel(event.level)}</p>
            <p className="text-muted-foreground">{LABELS.escalations.historyTriggered(formatDateTime(event.triggeredAt))}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
