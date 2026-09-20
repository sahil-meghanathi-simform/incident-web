// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { formatMinutes } from '../../../components/ui/SlaCountdown';
import { SEVERITY_LABEL, type Severity } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';
import type { TierInput } from '../schemas/tierSet.schema';

type TierPreviewProps = Readonly<{
  severity: Severity;
  tiers: readonly TierInput[];
}>;

/** "A Critical incident will escalate at 15m, 1h and 4h" (build-plan.md §15.2) —
 * thresholdMinutes is measured from the clock's start (highSeveritySince), not
 * relative to the previous level (src/jobs/escalation.job.ts), so the values are
 * listed in order exactly as stored. */
export function TierPreview({ severity, tiers }: TierPreviewProps): ReactElement | null {
  const thresholds = tiers
    .filter((t) => t.severity === severity)
    .sort((a, b) => a.level - b.level)
    .map((t) => (Number.isFinite(t.thresholdMinutes) ? formatMinutes(t.thresholdMinutes) : '?'));

  if (thresholds.length === 0) return null;

  return (
    <li className="space-y-1.5">
      <SeverityBadge severity={severity} />
      <p className="text-sm text-foreground-soft">{LABELS.admin.tierPreview(SEVERITY_LABEL[severity], thresholds)}</p>
    </li>
  );
}
