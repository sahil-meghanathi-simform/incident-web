import type { ReactElement } from 'react';
import { Spinner } from '../../../components/ui/Spinner';
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

  if (query.isPending) return <Spinner className="h-4 w-4" />;
  if (query.isError) return <p className="text-xs text-red-600">{LABELS.escalations.historyLoadError}</p>;
  if (query.data.events.length === 0) return <p className="text-xs text-slate-500">{LABELS.escalations.historyEmpty}</p>;

  return (
    <ol className="space-y-1.5">
      {query.data.events.map((event) => (
        <li key={event.id} className="flex items-baseline justify-between gap-3 text-xs">
          <span className="font-medium text-slate-700">{LABELS.escalations.dueLabel(event.level)}</span>
          <span className="text-slate-500">triggered {formatDateTime(event.triggeredAt)}</span>
        </li>
      ))}
    </ol>
  );
}
