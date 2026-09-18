import type { ReactElement } from 'react';
import { SEVERITY_LABEL, type Severity } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';
import type { TierInput } from '../schemas/tierSet.schema';

type TierPreviewProps = Readonly<{
  severity: Severity;
  tiers: readonly TierInput[];
}>;

/** "A CRITICAL incident will escalate at 15m, 60m and 240m" (build-plan.md §15.2) —
 * thresholdMinutes is measured from the clock's start (highSeveritySince), not
 * relative to the previous level (src/jobs/escalation.job.ts), so the values are
 * listed in order exactly as stored. */
export function TierPreview({ severity, tiers }: TierPreviewProps): ReactElement | null {
  const thresholds = tiers
    .filter((t) => t.severity === severity)
    .sort((a, b) => a.level - b.level)
    .map((t) => t.thresholdMinutes);

  if (thresholds.length === 0) return null;

  return <p className="text-sm text-slate-600">{LABELS.admin.tierPreview(SEVERITY_LABEL[severity], thresholds)}</p>;
}
