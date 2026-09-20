// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from './Badge';
import { LABELS } from '../../lib/labels';

// Opaque tint per level — see lib/severity.ts for why opacity-modified colors
// are dropped. One family in three weights (tint, deeper tint, solid), not a
// fourth rainbow duplicating the severity hues.
const LEVEL_CLASS: Record<number, string> = {
  1: 'bg-escalation-l1-surface text-escalation-l1 border-escalation-l1/40',
  2: 'bg-escalation-l2-surface text-escalation-l2 border-escalation-l2/40',
  3: 'bg-escalation-l3 text-escalation-l3-foreground border-escalation-l3',
};

export function EscalationBadge({ level }: { level: number }): ReactElement | null {
  if (level <= 0) return null;
  return (
    <Badge className={LEVEL_CLASS[level] ?? LEVEL_CLASS[3]}>
      <TrendingUp className="size-3" aria-hidden="true" />
      {LABELS.chrome.escalatedLevel(level)}
    </Badge>
  );
}
