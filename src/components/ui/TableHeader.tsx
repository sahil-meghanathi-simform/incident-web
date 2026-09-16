import type { ReactNode } from 'react';

export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-slate-50">
      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</tr>
    </thead>
  );
}
