// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Skeleton } from './Skeleton';
import { LABELS } from '../../lib/labels';
import { cn } from '../../lib/cn';

type SkeletonCardProps = Readonly<{
  /** `text` — heading + lines (default); `stat` — small label over a big number;
   * `list-item` — avatar dot, title and meta row. */
  variant?: 'text' | 'stat' | 'list-item';
  className?: string;
}>;

export function SkeletonCard({ variant = 'text', className }: SkeletonCardProps): ReactElement {
  return (
    <div role="status" className={cn('rounded-xl border border-border bg-card p-4', className)}>
      {variant === 'stat' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-16" />
        </div>
      )}
      {variant === 'list-item' && (
        <div className="flex gap-3">
          <Skeleton className="mt-1 size-2.5 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      )}
      {variant === 'text' && (
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}
      <span className="sr-only">{LABELS.chrome.loading}</span>
    </div>
  );
}
