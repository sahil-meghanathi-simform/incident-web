// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { cn } from '../../lib/cn';

/** A shimmering placeholder block. Under reduced motion it's a still tint. */
export function Skeleton({ className }: { className?: string }): ReactElement {
  return (
    <div
      className={cn(
        'rounded-md bg-muted bg-linear-to-r from-muted via-accent to-muted bg-size-[200%_100%] animate-shimmer motion-reduce:animate-none',
        className,
      )}
    />
  );
}
