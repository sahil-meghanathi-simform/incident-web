import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Badge({ className, children }: { className?: string; children: ReactNode }): ReactElement {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {children}
    </span>
  );
}
