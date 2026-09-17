import type { ReactElement } from 'react';
import { cn } from '../../lib/cn';

export function Skeleton({ className }: { className?: string }): ReactElement {
  return <div className={cn('animate-pulse rounded-md bg-slate-200', className)} />;
}
