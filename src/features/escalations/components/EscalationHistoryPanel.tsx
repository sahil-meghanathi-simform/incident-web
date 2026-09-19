import type { ReactElement } from 'react';
import { Loader2 } from 'lucide-react';
import { formatDateTime } from '../../../lib/datetime';
import { useIncidentEscalationEvents } from '../hooks/useIncidentEscalationEvents';
import { LABELS } from '../../../lib/labels';

type EscalationHistoryPanelProps = Readonly<{
  incidentId: string;
}>;

/**
 * The tier-by-tier record behind the Overview tab's escalation summary field —
 * TRIAGE_MANAGER/ADMIN only, same population as the `escalation` field itself
 * (§8.1). The caller only renders this once it already knows that field is present.
 */
export function EscalationHistoryPanel({ incidentId }: EscalationHistoryPanelProps): ReactElement {
  const query = useIncidentEscalationEvents(incidentId, true);

  if (query.isPending) return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />;
  if (query.isError) return <p className="text-xs text-destructive">{LABELS.escalations.historyLoadError}</p>;
  if (query.data.events.length === 0) return <p className="text-xs text-muted-foreground">{LABELS.escalations.historyEmpty}</p>;

  return (
    <ol className="space-y-1.5">
      {query.data.events.map((event) => (
        <li key={event.id} className="flex items-baseline justify-between gap-3 text-xs">
          <span className="font-medium text-foreground-soft">{LABELS.escalations.dueLabel(event.level)}</span>
          <span className="text-muted-foreground">triggered {formatDateTime(event.triggeredAt)}</span>
        </li>
      ))}
    </ol>
  );
}
