// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';
import { PASSWORD_CHECK_KEYS, scorePassword, type PasswordScore } from '../../../lib/passwordStrength';

type PasswordStrengthProps = Readonly<{
  value: string;
}>;

type StrengthLevel = keyof typeof LABELS.auth.strength.levels;

const LEVEL_BY_SCORE: Readonly<Record<PasswordScore, StrengthLevel>> = {
  0: 'empty',
  1: 'weak',
  2: 'fair',
  3: 'good',
  4: 'strong',
};

const FILL_BY_SCORE: Readonly<Record<PasswordScore, string>> = {
  0: 'bg-muted',
  1: 'bg-severity-critical',
  2: 'bg-severity-medium',
  3: 'bg-primary',
  4: 'bg-stage-closed',
};

const SEGMENTS = [1, 2, 3, 4] as const;

/**
 * Advisory only. The meter and the tips never block a submit — the sole enforced rule
 * is the 8-character minimum from the backend contract, marked "Required" here; every
 * other line sits under "Optional tips". The level is always spelled out in text, so
 * the colour is never the only signal (accessibility.md).
 */
export function PasswordStrength({ value }: PasswordStrengthProps): ReactElement {
  const { score, checks } = scorePassword(value);
  const copy = LABELS.auth.strength;
  const level = copy.levels[LEVEL_BY_SCORE[score]];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {SEGMENTS.map((segment) => (
            <span
              key={segment}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                segment <= score ? FILL_BY_SCORE[score] : 'bg-muted',
              )}
            />
          ))}
        </div>
        <p className="w-14 text-right text-xs font-medium text-foreground-soft" aria-live="polite">
          <span className="sr-only">{copy.meterLabel}: </span>
          {level}
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
        {PASSWORD_CHECK_KEYS.map((key) => {
          const isMet = checks[key];
          const Icon = isMet ? Check : Circle;
          return (
            <li
              key={key}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors',
                isMet ? 'text-foreground-soft' : 'text-muted-foreground',
              )}
            >
              <Icon
                className={cn('h-3.5 w-3.5 shrink-0', isMet ? 'text-stage-closed' : 'text-foreground-faint')}
                aria-hidden="true"
              />
              <span>
                {copy.checks[key]}
                {key === 'minLength' && <span className="text-foreground-faint"> · {copy.required}</span>}
                <span className="sr-only"> — {isMet ? copy.met : copy.notMet}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
