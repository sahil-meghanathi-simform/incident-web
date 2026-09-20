// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useDelayedFlag } from '../../hooks/useDelayedFlag';
import { LABELS } from '../../lib/labels';

type BusyRegionProps = Readonly<{
  /** True while the content shown is stale and fresh data is on its way (paging,
   * filtering, a refetch) — typically `query.isPlaceholderData || query.isFetching`. */
  isBusy: boolean;
  children: ReactNode;
  className?: string;
}>;

/**
 * Wraps content that is being refreshed in place: marks it aria-busy, dims it a
 * little and runs a slim progress bar across its top edge, so a slow page change
 * never looks like a dead click. Debounced — a fast refetch shows nothing.
 */
export function BusyRegion({ isBusy, children, className }: BusyRegionProps): ReactElement {
  const isShown = useDelayedFlag(isBusy, { showAfterMs: 150, minVisibleMs: 300 });
  return (
    <div aria-busy={isShown} className={cn('relative', className)}>
      {isShown && (
        <div
          className="pointer-events-none absolute inset-x-3 top-0 z-10 h-0.5 overflow-hidden rounded-full bg-primary/15"
          aria-hidden="true"
        >
          <div className="h-full w-full origin-left animate-loading-bar bg-primary motion-reduce:animate-none" />
        </div>
      )}
      <div className={cn('transition-opacity duration-200', isShown && 'opacity-60')}>{children}</div>
      {isShown && <span className="sr-only" role="status">{LABELS.chrome.updating}</span>}
    </div>
  );
}
