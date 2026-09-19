import type { ReactElement } from 'react';
import { Button } from './Button';
import { Spinner } from './Spinner';

type LoadMoreProps = Readonly<{
  hasMore: boolean;
  isLoading: boolean;
  onClick: () => void;
}>;

/** Cursor "load more" control (Q27). */
export function LoadMore({ hasMore, isLoading, onClick }: LoadMoreProps): ReactElement | null {
  if (!hasMore) return null;
  return (
    <div className="flex justify-center py-3">
      <Button variant="outline" onClick={onClick} disabled={isLoading}>
        {isLoading ? <Spinner className="h-4 w-4" /> : 'Load more'}
      </Button>
    </div>
  );
}
