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

export default function MyReportsPage() {
  useDocumentTitle('My Reports');
  const { page, setPage } = useOffsetPagination();
  const query = useMyIncidents(page);

  return (
    <PageContainer>
      <PageHeader
        title="My reports"
        description="Incidents you reported that you can still see — a report filed above your clearance won't appear here (Q9)."
      />

      {query.isPending && <SkeletonTable />}
      {query.isError && <ErrorState message="Could not load your reports." onRetry={() => query.refetch()} />}
      {query.data && query.data.items.length === 0 && (
        <EmptyState title="No reports yet" body="Incidents you file will show up here, as long as you can still see them." />
      )}
      {query.data && query.data.items.length > 0 && (
        <div className={query.isPlaceholderData ? 'opacity-60 transition-opacity' : undefined}>
          <IncidentTable items={query.data.items} />
          <TablePagination page={query.data.page} totalPages={query.data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
