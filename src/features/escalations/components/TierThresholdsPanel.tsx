// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { formatMinutes } from '../../../components/ui/SlaCountdown';
import { TierThresholdsFrame } from './TierThresholdsFrame';
import { useEscalationTiers } from '../hooks/useEscalationTiers';
import { LABELS } from '../../../lib/labels';
import type { Severity } from '../../../lib/severity';
import type { EscalationTier } from '../types/escalation.type';

type TierThresholdsPanelProps = Readonly<{ className?: string | undefined }>;

const SKELETON_ROWS = ['a', 'b'] as const;

/** "An empty feed still lists the current tier thresholds, so an empty screen teaches
 * what the system is watching for" (build-plan.md) — auth-open endpoint, safe for any
 * role. Renders nothing at all on error: a half-built card teaches nothing. */
export function TierThresholdsPanel({ className }: TierThresholdsPanelProps): ReactElement | null {
  const query = useEscalationTiers();

  if (query.isPending) {
    return (
      <TierThresholdsFrame className={className}>
        <div role="status" className="space-y-2">
          {SKELETON_ROWS.map((row) => (
            <div key={row} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          ))}
          <span className="sr-only">{LABELS.escalations.tiersLoading}</span>
        </div>
      </TierThresholdsFrame>
    );
  }
  if (query.isError || !query.data.tiers.length) return null;

  const bySeverity = new Map<Severity, EscalationTier[]>();
  for (const tier of query.data.tiers) {
    bySeverity.set(tier.severity, [...(bySeverity.get(tier.severity) ?? []), tier]);
  }

  return (
    <TierThresholdsFrame className={className}>
      <dl className="space-y-2">
        {[...bySeverity.entries()].map(([severity, tiers]) => (
          <div
            key={severity}
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5"
          >
            <dt>
              <SeverityBadge severity={severity} />
            </dt>
            <dd className="font-mono text-xs tabular-nums text-foreground-soft">
              {[...tiers]
                .sort((a, b) => a.level - b.level)
                .map((t) => `L${t.level} · ${formatMinutes(t.thresholdMinutes)}`)
                .join('  →  ')}
            </dd>
          </div>
        ))}
      </dl>
    </TierThresholdsFrame>
  );
}
