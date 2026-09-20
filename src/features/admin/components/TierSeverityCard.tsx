// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Card } from '../../../components/ui/Card';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { TierRow } from './TierRow';
import { LABELS } from '../../../lib/labels';
import type { Severity } from '../../../lib/severity';
import type { TierInput } from '../schemas/tierSet.schema';

type TierSeverityCardProps = Readonly<{
  severity: Severity;
  /** This severity's tiers, sorted by level. */
  tiers: readonly TierInput[];
  savedMinutes: ReadonlyMap<string, number>;
  rowErrors: ReadonlyMap<string, string>;
  onChange: (level: number, thresholdMinutes: number) => void;
}>;

export function TierSeverityCard({ severity, tiers, savedMinutes, rowErrors, onChange }: TierSeverityCardProps): ReactElement {
  return (
    <Card className="animate-in fade-in duration-300 motion-reduce:animate-none">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <SeverityBadge severity={severity} />
        <span className="text-xs text-muted-foreground">{LABELS.admin.tierCount(tiers.length)}</span>
      </div>
      <ul className="divide-y divide-border px-4 py-4 sm:px-5">
        {tiers.map((tier) => {
          const key = `${tier.severity}:${tier.level}`;
          return (
            <TierRow
              key={key}
              severity={tier.severity}
              level={tier.level}
              thresholdMinutes={tier.thresholdMinutes}
              savedMinutes={savedMinutes.get(key)}
              error={rowErrors.get(key)}
              onChange={(thresholdMinutes) => onChange(tier.level, thresholdMinutes)}
            />
          );
        })}
      </ul>
    </Card>
  );
}
