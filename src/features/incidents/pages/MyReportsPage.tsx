import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { TablePagination } from '../../../components/ui/TablePagination';
import { IncidentTable } from '../components/IncidentTable';
import { useMyIncidents } from '../hooks/useMyIncidents';
import { useOffsetPagination } from '../../../hooks/useOffsetPagination';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

export function MyReportsPage(): ReactElement {
  useDocumentTitle(LABELS.incidents.myReportsTitle);
  const { page, setPage } = useOffsetPagination();
  const query = useMyIncidents(page);

  return (
    <PageContainer>
      <PageHeader title={LABELS.incidents.myReportsTitle} description={LABELS.incidents.myReportsDescription} />

      {query.isPending && <SkeletonTable />}
      {query.isError && <ErrorState message={LABELS.incidents.loadMyReportsError} onRetry={() => query.refetch()} />}
      {query.data && query.data.items.length === 0 && (
        <EmptyState title={LABELS.incidents.noReportsYetTitle} body={LABELS.incidents.noReportsYetBody} />
      )}
      {query.data && query.data.items.length > 0 && (
        <div className={cn(query.isPlaceholderData && 'opacity-60 transition-opacity')}>
          <IncidentTable items={query.data.items} />
          <TablePagination page={query.data.page} totalPages={query.data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
