// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Spinner } from './Spinner';
import { LABELS } from '../../lib/labels';

type TablePaginationProps = Readonly<{
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** True while the next page is being fetched — shows an inline spinner. */
  isBusy?: boolean;
}>;

/** Offset table pagination (Q27). Kept as a page-index API, not a shadcn-style
 * anchor pagination (which assumes server-rendered page links) — every call
 * site drives this from URL-backed offset state via onPageChange callbacks.
 * Rendered in a Table's `footer` slot so it sits inside the same card. */
export function TablePagination({ page, totalPages, onPageChange, isBusy = false }: TablePaginationProps): ReactElement {
  const lastPage = Math.max(1, totalPages);
  return (
    <nav
      aria-label={LABELS.chrome.paginationLabel}
      className="flex items-center justify-between gap-3 border-t border-border bg-card px-4 py-2.5"
    >
      <span className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
        {LABELS.chrome.paginationPage(page, lastPage)}
        {isBusy && <Spinner size="sm" label={LABELS.chrome.updating} />}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label={LABELS.chrome.paginationPrevious}
        >
          <ChevronLeft aria-hidden="true" />
          <span className="max-sm:sr-only">{LABELS.chrome.paginationPreviousShort}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label={LABELS.chrome.paginationNext}
        >
          <span className="max-sm:sr-only">{LABELS.chrome.paginationNextShort}</span>
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
