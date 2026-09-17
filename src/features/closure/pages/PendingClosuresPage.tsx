import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { TablePagination } from '../../../components/ui/TablePagination';
import { PendingClosuresTable } from '../components/PendingClosuresTable';
import { useClosuresPending } from '../hooks/useClosuresPending';
import { useOffsetPagination } from '../../../hooks/useOffsetPagination';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

export function PendingClosuresPage(): ReactElement {
  useDocumentTitle(LABELS.closure.pendingQueueTitle);
  const { page, pageSize, setPage } = useOffsetPagination();
  const query = useClosuresPending(page, pageSize);

  return (
    <PageContainer>
      <PageHeader title={LABELS.closure.pendingQueueTitle} description={LABELS.closure.pendingQueueDescription} />

      {query.isPending && <SkeletonTable />}
      {query.isError && <ErrorState message={LABELS.closure.loadPendingQueueError} onRetry={() => query.refetch()} />}
      {query.data && query.data.items.length === 0 && (
        <EmptyState title={LABELS.closure.pendingQueueEmptyTitle} body={LABELS.closure.pendingQueueEmptyBody} />
      )}
      {query.data && query.data.items.length > 0 && (
        <div className={cn(query.isPlaceholderData && 'opacity-60 transition-opacity')}>
          <PendingClosuresTable items={query.data.items} />
          <TablePagination page={query.data.page} totalPages={query.data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
