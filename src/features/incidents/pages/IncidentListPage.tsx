// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { FilePlus, List } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { PagedQuerySection } from '../../../components/ui/PagedQuerySection';
import { RefreshIndicator } from '../../../components/ui/RefreshIndicator';
import { IncidentFilters } from '../components/IncidentFilters';
import { IncidentTable } from '../components/IncidentTable';
import { IncidentListEmpty } from '../components/IncidentListEmpty';
import { ReportIncidentButton } from '../components/ReportIncidentButton';
import { useIncidentFilters } from '../hooks/useIncidentFilters';
import { useIncidentList } from '../hooks/useIncidentList';
import { useAuth } from '../../../hooks/useAuth';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { SEVERITY_RANK } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';
import { CLEAR_FILTERS_PATCH, hasAnyFilter } from '../schemas/incidentFilterPatches';

export function IncidentListPage(): ReactElement {
  useDocumentTitle(LABELS.incidents.listTitle);
  const { user } = useAuth();
  const [filters, setFilters] = useIncidentFilters();
  const query = useIncidentList(filters);

  // A requested severity entirely above clearance narrows to empty rather than
  // erroring (server-enforced) — this is the one condition that lets the frontend
  // distinguish "your clearance hides everything" from "no matches" or "no data".
  const clearanceLimited =
    !!filters.severity?.length && filters.severity.every((s) => SEVERITY_RANK[s] > (user?.clearanceLevel ?? 1));

  return (
    <PageContainer size="wide">
      <PageHeader
        icon={List}
        title={LABELS.incidents.listTitle}
        description={LABELS.incidents.listDescription}
        meta={
          query.data ? (
            <RefreshIndicator isFetching={query.isFetching} updatedAt={query.dataUpdatedAt} onRefresh={() => void query.refetch()} />
          ) : undefined
        }
        actions={<ReportIncidentButton />}
      />
      <div className="mb-4">
        <IncidentFilters filters={filters} onChange={setFilters} isFetching={query.isFetching} />
      </div>

      <PagedQuerySection
        query={query}
        errorMessage={LABELS.incidents.loadListError}
        onPageChange={(page) => setFilters({ page })}
        skeletonColumns={8}
        empty={
          <IncidentListEmpty
            hasAnyFilter={hasAnyFilter(filters)}
            clearanceLimited={clearanceLimited}
            onClearFilters={() => setFilters(CLEAR_FILTERS_PATCH)}
            noDataAction={
              <ReportIncidentButton variant="link" icon={FilePlus} label={LABELS.incidents.reportTitle} />
            }
          />
        }
      >
        {(items, footer) => <IncidentTable items={items} footer={footer} />}
      </PagedQuerySection>
    </PageContainer>
  );
}
