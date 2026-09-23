// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Tooltip } from '../../../components/ui/Tooltip';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

type CopyReferenceButtonProps = Readonly<{
  reference: string;
  /** `labelled` — outline button with text; `icon` — compact icon button with a tooltip. */
  appearance?: 'labelled' | 'icon';
  className?: string;
}>;

type CopyState = 'idle' | 'copied' | 'failed';

const COPY = LABELS.incidents.copy;

/**
 * Copies an incident reference. Success flips the label to "Copied!" for two seconds;
 * a refused clipboard (insecure context, denied permission) shows an inline hint
 * instead — the reference is on screen either way, so copying is a convenience.
 * Deliberately no toast: this renders in context-free places (ClearanceNotice's spec).
 */
export function CopyReferenceButton({ reference, appearance = 'labelled', className }: CopyReferenceButtonProps): ReactElement {
  const [state, setState] = useState<CopyState>('idle');
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  async function handleCopy(): Promise<void> {
    window.clearTimeout(timerRef.current);
    try {
      await navigator.clipboard.writeText(reference);
      setState('copied');
      timerRef.current = window.setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('failed');
    }
  }

  const isCopied = state === 'copied';
  const label = isCopied ? COPY.copied : COPY.copyReference;
  const Icon = isCopied ? Check : Copy;

  return (
    <span className={cn('inline-flex flex-col gap-1', className)}>
      {appearance === 'icon' ? (
        <Tooltip label={label}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn('size-8', isCopied && 'text-success')}
            onClick={handleCopy}
            aria-label={label}
          >
            <Icon aria-hidden="true" />
          </Button>
        </Tooltip>
      ) : (
        <Button type="button" variant="outline" size="sm" className={cn(isCopied && 'text-success')} onClick={handleCopy}>
          <Icon aria-hidden="true" />
          {label}
        </Button>
      )}
      {state === 'failed' && (
        <span role="status" className="text-xs text-destructive animate-in fade-in duration-200">
          {COPY.copyFailed}
        </span>
      )}
    </span>
  );
}
