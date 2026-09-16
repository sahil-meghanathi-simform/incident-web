import { Skeleton } from './Skeleton';

export function SkeletonCard() {
  return (
    <div className="space-y-2 rounded-lg border border-slate-200 p-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
