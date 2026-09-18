import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { TablePagination } from '../../../components/ui/TablePagination';
import { AuditFilters } from '../components/AuditFilters';
import { AuditTable } from '../components/AuditTable';
import { useAuditFilters } from '../hooks/useAuditFilters';
import { useAuditSearch } from '../hooks/useAuditSearch';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

export function AuditLogPage(): ReactElement {
  useDocumentTitle(LABELS.admin.auditLogTitle);
  const [filters, setFilters] = useAuditFilters();
  const query = useAuditSearch(filters);

  return (
    <PageContainer>
      <PageHeader title={LABELS.admin.auditLogTitle} description={LABELS.admin.auditLogDescription} />

      <AuditFilters filters={filters} onChange={setFilters} />

      {query.isPending && <SkeletonTable />}
      {query.isError && <ErrorState message={LABELS.admin.loadAuditError} onRetry={() => query.refetch()} />}
      {query.data && query.data.items.length === 0 && (
        <EmptyState title={LABELS.admin.auditEmptyTitle} body={LABELS.admin.auditEmptyBody} />
      )}
      {query.data && query.data.items.length > 0 && (
        <div className={cn(query.isPlaceholderData && 'opacity-60 transition-opacity')}>
          <AuditTable items={query.data.items} />
          <TablePagination
            page={query.data.page}
            totalPages={query.data.totalPages}
            onPageChange={(page) => setFilters({ page })}
          />
        </div>
      )}
    </PageContainer>
  );
}
