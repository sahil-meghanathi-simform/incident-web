import type { ReactElement } from 'react';
import { Skeleton } from './Skeleton';

export function SkeletonCard(): ReactElement {
  return (
    <div role="status" className="space-y-2 rounded-lg border border-border p-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
