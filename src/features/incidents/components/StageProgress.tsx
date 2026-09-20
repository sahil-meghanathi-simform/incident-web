// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Check } from 'lucide-react';
import { STAGE_LABEL, STAGE_ORDER, type Stage } from '../../../lib/stage';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

type StageProgressProps = Readonly<{
  stage: Stage;
}>;

type StepState = 'complete' | 'current' | 'upcoming';

const STEP_CLASS: Readonly<Record<StepState, string>> = {
  complete: 'border-primary/30 bg-accent text-accent-foreground',
  current: 'border-primary bg-primary text-primary-foreground shadow-sm',
  upcoming: 'border-dashed border-border bg-card text-muted-foreground',
};

function stepState(index: number, currentIndex: number, isClosed: boolean): StepState {
  if (index < currentIndex || (isClosed && index === currentIndex)) return 'complete';
  return index === currentIndex ? 'current' : 'upcoming';
}

/**
 * The five workflow stages as an ordered list. Each step carries an icon and spelled
 * out state text (never colour alone); the current one is `aria-current="step"`.
 * Scrolls sideways on narrow screens rather than wrapping.
 */
export function StageProgress({ stage }: StageProgressProps): ReactElement {
  const currentIndex = STAGE_ORDER.indexOf(stage);
  const isClosed = stage === 'CLOSED';
  const copy = LABELS.incidents.detail;

  return (
    <ol
      aria-label={copy.progressLabel}
      className="-mx-1 flex items-center gap-1 overflow-x-auto overscroll-x-contain px-1 py-1 [scrollbar-width:none]"
    >
      {STAGE_ORDER.map((step, index) => {
        const state = stepState(index, currentIndex, isClosed);
        return (
          <li
            key={step}
            aria-current={step === stage ? 'step' : undefined}
            className="flex shrink-0 items-center gap-1"
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn('h-0.5 w-4 rounded-full sm:w-6', index <= currentIndex ? 'bg-primary/60' : 'bg-border')}
              />
            )}
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
                STEP_CLASS[state],
              )}
            >
              {state === 'complete' ? (
                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              ) : (
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-2 rounded-full',
                    state === 'current' ? 'bg-primary-foreground' : 'border border-foreground-faint',
                  )}
                />
              )}
              {STAGE_LABEL[step]}
              <span className="sr-only">
                {' '}
                {copy.stepState[state]}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
