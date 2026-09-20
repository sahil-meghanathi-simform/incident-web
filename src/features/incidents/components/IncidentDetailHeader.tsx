// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Lock } from 'lucide-react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { StageBadge } from '../../../components/ui/StageBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { CopyReferenceButton } from './CopyReferenceButton';
import { StageProgress } from './StageProgress';
import { formatDateTime } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../types/incident.type';

type IncidentDetailHeaderProps = Readonly<{
  incident: IncidentDetail;
}>;

/** Reference, title, badges and stage progress. The action buttons driven by
 * `_actions` render separately, in IncidentActionBar (Module 4) — a UI hint only;
 * every action endpoint re-checks server-side (§8.1). The closed banner (build-plan.md
 * §Module 6) is visible to everyone who can see the incident at all — `closure`
 * carries the same visibility rule as rootCause/correctiveAction, never gated behind
 * canSeeAssignment. */
export function IncidentDetailHeader({ incident }: IncidentDetailHeaderProps): ReactElement {
  return (
    <header className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-0.5">
            <span className="font-mono text-sm font-medium text-muted-foreground">{incident.reference}</span>
            <CopyReferenceButton reference={incident.reference} appearance="icon" />
          </div>
          <h1 className="break-words font-display text-2xl font-semibold tracking-display text-foreground sm:text-3xl">
            {incident.title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:pt-8">
          <SeverityBadge severity={incident.severity} />
          <StageBadge stage={incident.stage} />
          <EscalationBadge level={incident.escalation?.currentEscalationLevel ?? 0} />
        </div>
      </div>
      <StageProgress stage={incident.stage} />
      {incident.closure && (
        <Alert variant="success" role="note" className="flex gap-2.5">
          <Lock aria-hidden="true" />
          <AlertDescription>
            {LABELS.closure.closedBanner(
              formatDateTime(incident.closure.closedAt),
              incident.closure.closedBy?.displayName ?? LABELS.incidents.detail.removedUser,
            )}
          </AlertDescription>
        </Alert>
      )}
    </header>
  );
}
