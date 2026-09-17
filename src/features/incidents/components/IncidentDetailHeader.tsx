import type { ReactElement } from 'react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { StageBadge } from '../../../components/ui/StageBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { Heading } from '../../../components/ui/Heading';
import type { IncidentDetail } from '../types/incident.type';

type IncidentDetailHeaderProps = Readonly<{
  incident: IncidentDetail;
}>;

/** Reference, badges, and action buttons — the latter driven entirely by `_actions`,
 * a UI hint only; every action endpoint re-checks server-side (§8.1). Actions
 * themselves land in Modules 4-6, so this only renders the badges for now. */
export function IncidentDetailHeader({ incident }: IncidentDetailHeaderProps): ReactElement {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
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
  );
}
