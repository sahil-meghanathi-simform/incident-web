// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

type ClearanceBadgeProps = Readonly<{
  level: number;
}>;

const LADDER_STEPS = [1, 2, 3, 4] as const;

// Static per-step heights so the ladder reads as rising rungs.
const STEP_HEIGHT: Readonly<Record<(typeof LADDER_STEPS)[number], string>> = {
  1: 'h-1.5',
  2: 'h-2',
  3: 'h-2.5',
  4: 'h-3',
};

/** "Level N" plus a four-rung ladder — the word carries the meaning, the ladder is
 * a glanceable extra (aria-hidden), so it never relies on colour alone. */
export function ClearanceBadge({ level }: ClearanceBadgeProps): ReactElement {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-foreground-soft">
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {LADDER_STEPS.map((step) => (
          <span
            key={step}
            className={cn('w-1 rounded-sm', STEP_HEIGHT[step], step <= level ? 'bg-primary' : 'bg-border')}
          />
        ))}
      </span>
      {LABELS.admin.clearanceLevelLabel(level)}
    </span>
  );
}
