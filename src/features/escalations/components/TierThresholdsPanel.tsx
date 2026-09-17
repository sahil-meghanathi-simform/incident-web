import type { ReactElement } from 'react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { Spinner } from '../../../components/ui/Spinner';
import { formatMinutes } from '../../../components/ui/SlaCountdown';
import { useEscalationTiers } from '../hooks/useEscalationTiers';
import type { Severity } from '../../../lib/severity';

/** "An empty feed still lists the current tier thresholds, so an empty screen teaches
 * what the system is watching for" (build-plan.md) — auth-open endpoint, safe for any role. */
export function TierThresholdsPanel(): ReactElement | null {
  const query = useEscalationTiers();

  if (query.isPending) return <Spinner className="h-4 w-4" />;
  if (query.isError || !query.data.tiers.length) return null;

  const bySeverity = new Map<Severity, typeof query.data.tiers>();
  for (const tier of query.data.tiers) {
    bySeverity.set(tier.severity, [...(bySeverity.get(tier.severity) ?? []), tier]);
  }

  return (
    <dl className="mx-auto flex max-w-sm flex-col gap-2 text-left">
      {[...bySeverity.entries()].map(([severity, tiers]) => (
        <div key={severity} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2">
          <dt>
            <SeverityBadge severity={severity} />
          </dt>
          <dd className="text-xs text-slate-600">
            {[...tiers]
              .sort((a, b) => a.level - b.level)
              .map((t) => `L${t.level} · ${formatMinutes(t.thresholdMinutes)}`)
              .join('  →  ')}
          </dd>
        </div>
      ))}
    </dl>
  );
}
