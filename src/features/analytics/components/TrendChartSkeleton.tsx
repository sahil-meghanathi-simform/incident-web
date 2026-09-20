// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { LABELS } from '../../../lib/labels';
import { cn } from '../../../lib/cn';

// Fixed silhouette heights (not data) — a stable, bar-chart-shaped placeholder.
const BARS = [
  { id: 'a', height: 'h-1/3' },
  { id: 'b', height: 'h-1/2' },
  { id: 'c', height: 'h-2/5' },
  { id: 'd', height: 'h-3/4' },
  { id: 'e', height: 'h-3/5' },
  { id: 'f', height: 'h-4/5' },
  { id: 'g', height: 'h-1/2' },
  { id: 'h', height: 'h-2/3' },
  { id: 'i', height: 'h-2/5' },
  { id: 'j', height: 'h-3/5' },
] as const;

/** Chart-height placeholder matching TrendChart's plot box, so nothing jumps. */
export function TrendChartSkeleton(): ReactElement {
  return (
    <div role="status" className="space-y-4">
      <div className="flex gap-2">
        <div className="flex h-56 w-9 shrink-0 flex-col justify-between py-1 sm:h-64 lg:h-72">
          <Skeleton className="ml-auto h-2.5 w-5" />
          <Skeleton className="ml-auto h-2.5 w-5" />
          <Skeleton className="ml-auto h-2.5 w-5" />
        </div>
        <div className="flex h-56 min-w-0 flex-1 items-end gap-2 border-b border-border pr-4 sm:h-64 sm:gap-3 lg:h-72">
          {BARS.map((bar) => (
            <Skeleton key={bar.id} className={cn('flex-1 rounded-b-none', bar.height)} />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pl-11">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <span className="sr-only">{LABELS.analytics.trendLoading}</span>
    </div>
  );
}
