// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { SkeletonTable } from './SkeletonTable';
import { ErrorState } from './ErrorState';
import { TablePagination } from './TablePagination';
import { BusyRegion } from './BusyRegion';

type PagedData<TItem> = Readonly<{
  items: readonly TItem[];
  page: number;
  totalPages: number;
}>;

/** The slice of a TanStack Query result this component reads — a full
 * UseQueryResult satisfies it structurally. */
type PagedQuery<TItem> = Readonly<{
  data: PagedData<TItem> | undefined;
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  refetch: () => unknown;
}>;

type PagedQuerySectionProps<TItem> = Readonly<{
  query: PagedQuery<TItem>;
  errorMessage: string;
  /** Rendered when the first page comes back empty (an EmptyState). */
  empty: ReactNode;
  onPageChange: (page: number) => void;
  skeletonColumns?: number;
  /** Render the table; place `footer` in the Table's `footer` slot so pagination
   * sits inside the same card. */
  children: (items: readonly TItem[], footer: ReactNode) => ReactNode;
}>;

/**
 * The loading → error → empty → table sequence shared by every offset-paginated list
 * page. Page changes keep the previous rows visible (placeholder data) inside a
 * BusyRegion, and the pagination shows its own inline spinner, so there's always
 * visible feedback that the next page is on its way.
 */
export function PagedQuerySection<TItem>({
  query,
  errorMessage,
  empty,
  onPageChange,
  skeletonColumns = 6,
  children,
}: PagedQuerySectionProps<TItem>): ReactElement | null {
  if (query.isPending) return <SkeletonTable columns={skeletonColumns} />;
  if (query.isError && !query.data) return <ErrorState message={errorMessage} onRetry={() => query.refetch()} />;
  if (!query.data) return null;
  if (query.data.items.length === 0) return <>{empty}</>;

  const isBusy = query.isPlaceholderData || (query.isFetching && !query.isPending);
  const footer = (
    <TablePagination
      page={query.data.page}
      totalPages={query.data.totalPages}
      onPageChange={onPageChange}
      isBusy={query.isPlaceholderData}
    />
  );

  return <BusyRegion isBusy={isBusy}>{children(query.data.items, footer)}</BusyRegion>;
}
