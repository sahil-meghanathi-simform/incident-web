// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/cn';
import { LABELS } from '../../lib/labels';

type CharacterCountProps = Readonly<{
  count: number;
  max: number;
  /** Minimum length, if the field has one — shows "N more to go" until it's met. */
  min?: number;
  id?: string;
  className?: string;
}>;

/**
 * Live length feedback for a textarea. The `{count} / {max}` text stays one text
 * node in exactly that format (NoteComposer's spec asserts '4001 / 4000'). Over the
 * limit it turns destructive and gains an icon, so the state isn't colour alone;
 * near the limit it turns warning.
 */
export function CharacterCount({ count, max, min, id, className }: CharacterCountProps): ReactElement {
  const isOver = count > max;
  const isNear = !isOver && count >= max * 0.9;
  const remainingToMin = min !== undefined && count > 0 && count < min ? min - count : 0;

  return (
    <p
      id={id}
      aria-live="polite"
      className={cn(
        'flex items-center gap-1.5 text-xs tabular-nums',
        isOver ? 'font-medium text-destructive' : isNear ? 'text-warning' : 'text-muted-foreground',
        className,
      )}
    >
      {isOver && <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />}
      {remainingToMin > 0 && (
        <span className="text-muted-foreground">{LABELS.chrome.characterCountShort(remainingToMin)} ·</span>
      )}
      <span>{LABELS.chrome.characterCount(count, max)}</span>
      {isOver && <span className="sr-only">{LABELS.chrome.overLimit}</span>}
    </p>
  );
}
