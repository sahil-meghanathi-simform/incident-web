import type { ReactElement } from 'react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { StageBadge } from '../../../components/ui/StageBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { Heading } from '../../../components/ui/Heading';
import { formatDateTime } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../types/incident.type';

type IncidentDetailHeaderProps = Readonly<{
  incident: IncidentDetail;
}>;

/** Reference and badges. The action buttons driven by `_actions` render separately,
 * in IncidentActionBar (Module 4) — a UI hint only; every action endpoint re-checks
 * server-side (§8.1). The closed banner (build-plan.md §Module 6) is visible to
 * everyone who can see the incident at all — `closure` carries the same visibility
 * rule as rootCause/correctiveAction, never gated behind canSeeAssignment. */
export function IncidentDetailHeader({ incident }: IncidentDetailHeaderProps): ReactElement {
  return (
    <div className="space-y-3 border-b border-slate-200 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-slate-500">{incident.reference}</p>
          <Heading className="mt-0.5">{incident.title}</Heading>
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <StageBadge stage={incident.stage} />
          <EscalationBadge level={incident.escalation?.currentEscalationLevel ?? 0} />
        </div>
      </div>
      {incident.closure && (
        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {LABELS.closure.closedBanner(
            formatDateTime(incident.closure.closedAt),
            incident.closure.closedBy?.displayName ?? 'someone since removed',
          )}
        </p>
      )}
    </div>
  );
}
