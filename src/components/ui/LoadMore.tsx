import { Button } from './Button';
import { Spinner } from './Spinner';

interface LoadMoreProps {
  hasMore: boolean;
  isLoading: boolean;
  onClick: () => void;
}

/** Cursor "load more" control (Q27). */
export function LoadMore({ hasMore, isLoading, onClick }: LoadMoreProps) {
  if (!hasMore) return null;
  return (
    <div className="flex justify-center py-3">
      <Button variant="secondary" onClick={onClick} disabled={isLoading}>
        {isLoading ? <Spinner className="h-4 w-4" /> : 'Load more'}
      </Button>
    </div>
  );
}
