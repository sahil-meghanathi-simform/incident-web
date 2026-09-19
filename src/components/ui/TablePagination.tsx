// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

type TablePaginationProps = Readonly<{
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}>;

/** Offset table pagination (Q27). Kept as a page-index API, not a shadcn-style
 * anchor pagination (which assumes server-rendered page links) — every call
 * site drives this from URL-backed offset state via onPageChange callbacks. */
export function TablePagination({ page, totalPages, onPageChange }: TablePaginationProps): ReactElement {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <span className="text-xs text-muted-foreground">
        Page {page} of {Math.max(1, totalPages)}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>
        <Button variant="outline" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
