import type { ReactElement } from 'react';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type ClosureSummaryCardProps = Readonly<{
  incident: IncidentDetail;
}>;

/** The permanent, read-only closed-state record — CLOSED has no outgoing transitions
 * (stage.policy.ts), so nothing here ever needs an action button again. The "Closed on
 * … by …" banner itself renders once, in IncidentDetailHeader, visible on every tab. */
export function ClosureSummaryCard({ incident }: ClosureSummaryCardProps): ReactElement {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{LABELS.closure.rootCauseLabel}</h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{incident.rootCause}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {LABELS.closure.correctiveActionLabel}
          </h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{incident.correctiveAction}</p>
        </div>
      </div>
    </div>
  );
}
