import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className={cn('w-full min-w-full divide-y divide-slate-200 text-sm', className)}>{children}</table>
    </div>
  );
}
