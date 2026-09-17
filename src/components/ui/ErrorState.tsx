import type { ReactElement } from 'react';
import { Button } from './Button';

type ErrorStateProps = Readonly<{
  message?: string;
  requestId?: string;
  onRetry?: () => void;
}>;

export function ErrorState({ message = 'Something went wrong.', requestId, onRetry }: ErrorStateProps): ReactElement {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center">
      <p className="text-sm font-medium text-red-800">{message}</p>
      {requestId && <p className="text-xs text-red-500">Reference: {requestId}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-2">
          Retry
        </Button>
      )}
    </div>
  );
}
