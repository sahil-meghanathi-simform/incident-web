// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { cn } from '../../lib/cn';

type SeparatorProps = Readonly<{
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}>;

/** Hand-rolled, not @radix-ui/react-separator — a single styled <div> with no
 * interaction states doesn't earn a dependency. */
export function Separator({ orientation = 'horizontal', className }: SeparatorProps): ReactElement {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
    />
  );
}
