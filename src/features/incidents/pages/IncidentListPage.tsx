import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { TablePagination } from '../../../components/ui/TablePagination';
import { IncidentFilters } from '../components/IncidentFilters';
import { IncidentTable } from '../components/IncidentTable';
import { IncidentListEmpty } from '../components/IncidentListEmpty';
import { useIncidentFilters } from '../hooks/useIncidentFilters';
import { useIncidentList } from '../hooks/useIncidentList';
import { useAuth } from '../../../hooks/useAuth';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { SEVERITY_RANK } from '../../../lib/severity';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

export function IncidentListPage(): ReactElement {
  useDocumentTitle(LABELS.incidents.listTitle);
  const { user } = useAuth();
  const [filters, setFilters] = useIncidentFilters();
  const query = useIncidentList(filters);

  const hasAnyFilter =
    !!filters.severity?.length ||
    !!filters.stage?.length ||
    !!filters.type?.length ||
    !!filters.assignedToMe ||
    !!filters.reportedByMe ||
    !!filters.unacknowledged ||
    !!filters.escalatedOnly ||
    !!filters.from ||
    !!filters.to ||
    !!filters.q;

  // A requested severity entirely above clearance narrows to empty rather than
  // erroring (server-enforced) — this is the one condition that lets the frontend
  // distinguish "your clearance hides everything" from "no matches" or "no data".
  const clearanceLimited =
    !!filters.severity?.length && filters.severity.every((s) => SEVERITY_RANK[s] > (user?.clearanceLevel ?? 1));

  return (
    <PageContainer>
      <PageHeader title={LABELS.incidents.listTitle} description={LABELS.incidents.listDescription} />
      <div className="mb-4">
        <IncidentFilters filters={filters} onChange={setFilters} />
      </div>

      {query.isPending && <SkeletonTable />}
      {query.isError && <ErrorState message={LABELS.incidents.loadListError} onRetry={() => query.refetch()} />}
      {query.data && query.data.items.length === 0 && (
        <IncidentListEmpty
          hasAnyFilter={hasAnyFilter}
          clearanceLimited={clearanceLimited}
          onClearFilters={() =>
            setFilters({
              severity: undefined,
              stage: undefined,
              type: undefined,
              assignedToMe: undefined,
              reportedByMe: undefined,
              unacknowledged: undefined,
              escalatedOnly: undefined,
              from: undefined,
              to: undefined,
              q: undefined,
            })
          }
        />
      )}
      {query.data && query.data.items.length > 0 && (
        <div className={cn(query.isPlaceholderData && 'opacity-60 transition-opacity')}>
          <IncidentTable items={query.data.items} />
          <TablePagination page={query.data.page} totalPages={query.data.totalPages} onPageChange={(page) => setFilters({ page })} />
        </div>
      )}
    </PageContainer>
  );
}
