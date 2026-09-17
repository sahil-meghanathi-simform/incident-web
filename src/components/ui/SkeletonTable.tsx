import type { ReactElement } from 'react';
import { Skeleton } from './Skeleton';

export function SkeletonTable({ rows = 6, columns = 5 }: { rows?: number; columns?: number }): ReactElement {
  return (
    <div role="status" className="space-y-2 rounded-lg border border-slate-200 p-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`row-${r}`} className="flex gap-3">
          {Array.from({ length: columns }).map((__, c) => (
            <Skeleton key={`col-${c}`} className="h-5 flex-1" />
          ))}
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
