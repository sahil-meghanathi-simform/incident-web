import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { TablePagination } from '../../../components/ui/TablePagination';
import { InvestigationQueueTable } from '../components/InvestigationQueueTable';
import { useMyInvestigations } from '../hooks/useMyInvestigations';
import { useOffsetPagination } from '../../../hooks/useOffsetPagination';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

export function MyInvestigationsPage(): ReactElement {
  useDocumentTitle(LABELS.investigation.myInvestigationsTitle);
  const { page, pageSize, setPage } = useOffsetPagination();
  const query = useMyInvestigations(page, pageSize);

  return (
    <PageContainer>
      <PageHeader
        title={LABELS.investigation.myInvestigationsTitle}
        description={LABELS.investigation.myInvestigationsDescription}
      />

      {query.isPending && <SkeletonTable />}
      {query.isError && (
        <ErrorState message={LABELS.investigation.loadMyInvestigationsError} onRetry={() => query.refetch()} />
      )}
      {query.data && query.data.items.length === 0 && (
        <EmptyState
          title={LABELS.investigation.noInvestigationsTitle}
          body={LABELS.investigation.noInvestigationsBody}
        />
      )}
      {query.data && query.data.items.length > 0 && (
        <div className={cn(query.isPlaceholderData && 'opacity-60 transition-opacity')}>
          <InvestigationQueueTable items={query.data.items} />
          <TablePagination page={query.data.page} totalPages={query.data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
