import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      {/* Explicit bg-white: a <table> has no background of its own, so on the dark
          theme's body this row/cell text (hardcoded slate-900, like Input/Textarea)
          would otherwise render dark-on-dark and be effectively invisible. */}
      <table className={cn('w-full min-w-full divide-y divide-slate-200 bg-white text-sm', className)}>
        {children}
      </table>
    </div>
  );
}
