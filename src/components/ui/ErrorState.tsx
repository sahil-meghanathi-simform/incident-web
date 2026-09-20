// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from './Button';
import { LABELS } from '../../lib/labels';

type ErrorStateProps = Readonly<{
  message?: string;
  requestId?: string;
  onRetry?: () => void;
}>;

export function ErrorState({ message = LABELS.chrome.errorDefault, requestId, onRetry }: ErrorStateProps): ReactElement {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-destructive/25 bg-destructive/5 px-6 py-10 text-center animate-in fade-in duration-300"
    >
      <span className="mb-1 flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </span>
      <p className="max-w-md text-sm font-medium text-destructive">{message}</p>
      {requestId && <p className="font-mono text-xs text-destructive/80">{LABELS.chrome.requestReference(requestId)}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          <RotateCw aria-hidden="true" />
          {LABELS.chrome.retry}
        </Button>
      )}
    </div>
  );
}
