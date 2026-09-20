// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../lib/cn';
import { formatRelative } from '../../lib/datetime';
import { LABELS } from '../../lib/labels';
import { useDelayedFlag } from '../../hooks/useDelayedFlag';

type RefreshIndicatorProps = Readonly<{
  isFetching: boolean;
  /** `query.dataUpdatedAt` — epoch ms, 0 before the first success. */
  updatedAt: number;
  onRefresh: () => void;
  /** Adds an "Auto-refreshing" pulse for pages that poll on an interval. */
  isAutoRefreshing?: boolean;
}>;

/** "Updated 2 minutes ago · ⟳" for polled or long-lived pages — shows data freshness
 * and gives a manual refresh that spins while a fetch is in flight. */
export function RefreshIndicator({ isFetching, updatedAt, onRefresh, isAutoRefreshing = false }: RefreshIndicatorProps): ReactElement {
  const isSpinning = useDelayedFlag(isFetching, { showAfterMs: 100, minVisibleMs: 500 });
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      {isAutoRefreshing && (
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full rounded-full bg-success/60 animate-ping motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          {LABELS.chrome.autoRefreshing}
          <span aria-hidden="true">·</span>
        </span>
      )}
      {updatedAt > 0 && <span>{LABELS.chrome.lastUpdated(formatRelative(new Date(updatedAt)))}</span>}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isSpinning}
        aria-label={LABELS.chrome.refreshNow}
        aria-busy={isSpinning}
        className="inline-flex size-7 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-progress"
      >
        <RefreshCw className={cn('size-3.5', isSpinning && 'animate-spin motion-reduce:animate-none')} aria-hidden="true" />
      </button>
    </span>
  );
}
