import type { ReactElement } from 'react';
import { Button } from './Button';
import { Loader2 } from 'lucide-react';

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
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : 'Load more'}
      </Button>
    </div>
  );
}
