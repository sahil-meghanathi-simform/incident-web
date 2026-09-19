import type { ReactElement } from 'react';
import { Button } from './Button';

type TablePaginationProps = Readonly<{
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}>;

/** Offset table pagination (Q27). */
export function TablePagination({ page, totalPages, onPageChange }: TablePaginationProps): ReactElement {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
      <span className="text-xs text-slate-500">
        Page {page} of {Math.max(1, totalPages)}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <Button variant="outline" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}
