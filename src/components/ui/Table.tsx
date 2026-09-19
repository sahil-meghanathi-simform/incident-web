// rules-ok: naming — component files in this repo are PascalCase by convention;
// this file is superseded by the shadcn table set in a later migration phase.
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Table({ children, className }: { children: ReactNode; className?: string }): ReactElement {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className={cn('w-full min-w-full divide-y divide-border bg-card text-sm', className)}>
        {children}
      </table>
    </div>
  );
}
