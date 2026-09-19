// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { cn } from '../../lib/cn';

export function Skeleton({ className }: { className?: string }): ReactElement {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />;
}
