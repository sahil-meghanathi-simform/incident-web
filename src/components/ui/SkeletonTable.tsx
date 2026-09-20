// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Skeleton } from './Skeleton';
import { LABELS } from '../../lib/labels';
import { cn } from '../../lib/cn';

type SkeletonTableProps = Readonly<{
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}>;

// Varied widths so the placeholder reads as a table of real data rather than a
// grid of identical bars — indexed by column position, cycling.
const CELL_WIDTHS = ['w-24', 'w-4/5', 'w-16', 'w-20', 'w-3/5', 'w-14', 'w-2/3', 'w-12'] as const;

function cellWidth(column: number): string {
  return CELL_WIDTHS[column % CELL_WIDTHS.length] ?? 'w-16';
}

export function SkeletonTable({ rows = 6, columns = 5, showHeader = true }: SkeletonTableProps): ReactElement {
  const columnKeys = Array.from({ length: columns }, (_, c) => `col-${c}`);
  return (
    <div role="status" className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {showHeader && (
        <div className="flex gap-4 border-b border-border bg-muted/70 px-4 py-3">
          {columnKeys.map((key) => (
            <div key={`head-${key}`} className="flex-1">
              <Skeleton className="h-3 w-16 bg-border" />
            </div>
          ))}
        </div>
      )}
      <div className="divide-y divide-border">
        {Array.from({ length: rows }, (_, r) => `row-${r}`).map((rowKey) => (
          <div key={rowKey} className="flex items-center gap-4 px-4 py-3.5">
            {columnKeys.map((key, c) => (
              <div key={`${rowKey}-${key}`} className="flex-1">
                <Skeleton className={cn('h-4 max-w-full', cellWidth(c))} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">{LABELS.chrome.loading}</span>
    </div>
  );
}
