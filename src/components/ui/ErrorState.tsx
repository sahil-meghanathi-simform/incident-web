import type { ReactElement } from 'react';
import { Button } from './Button';

type ErrorStateProps = Readonly<{
  message?: string;
  requestId?: string;
  onRetry?: () => void;
}>;

export function ErrorState({ message = 'Something went wrong.', requestId, onRetry }: ErrorStateProps): ReactElement {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-6 py-10 text-center">
      <p className="text-sm font-medium text-destructive">{message}</p>
      {requestId && <p className="text-xs text-destructive/80">Reference: {requestId}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          Retry
        </Button>
      )}
    </div>
  );
}
