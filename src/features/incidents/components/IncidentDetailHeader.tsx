import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { StageBadge } from '../../../components/ui/StageBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import type { IncidentDetail } from '../types/incident.type';

/** Reference, badges, and action buttons — the latter driven entirely by `_actions`,
 * a UI hint only; every action endpoint re-checks server-side (§8.1). Actions
 * themselves land in Modules 4-6, so this only renders the badges for now. */
export function IncidentDetailHeader({ incident }: { incident: IncidentDetail }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <div>
        <p className="font-mono text-sm text-slate-500">{incident.reference}</p>
        <h1 className="mt-0.5 text-lg font-semibold text-slate-900">{incident.title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <SeverityBadge severity={incident.severity} />
        <StageBadge stage={incident.stage} />
        <EscalationBadge level={incident.escalation?.currentEscalationLevel ?? 0} />
      </div>
    </div>
  );
}
