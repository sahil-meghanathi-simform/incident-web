// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { LABELS } from '../../lib/labels';

type LoadMoreProps = Readonly<{
  hasMore: boolean;
  isLoading: boolean;
  onClick: () => void;
  label?: string;
}>;

/** Cursor "load more" control (Q27). The label stays put while loading (the
 * button's spinner appears beside it) so the control never jumps in width. */
export function LoadMore({ hasMore, isLoading, onClick, label = LABELS.chrome.loadMore }: LoadMoreProps): ReactElement | null {
  if (!hasMore) return null;
  return (
    <div className="flex justify-center py-3">
      <Button variant="outline" size="sm" onClick={onClick} isLoading={isLoading}>
        {!isLoading && <ChevronDown aria-hidden="true" />}
        {label}
      </Button>
    </div>
  );
}
