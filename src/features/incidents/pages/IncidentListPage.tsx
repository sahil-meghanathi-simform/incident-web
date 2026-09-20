// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, List, Plus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { PagedQuerySection } from '../../../components/ui/PagedQuerySection';
import { RefreshIndicator } from '../../../components/ui/RefreshIndicator';
import { Button } from '../../../components/ui/Button';
import { TextLink } from '../../../components/ui/TextLink';
import { IncidentFilters } from '../components/IncidentFilters';
import { IncidentTable } from '../components/IncidentTable';
import { IncidentListEmpty } from '../components/IncidentListEmpty';
import { useIncidentFilters } from '../hooks/useIncidentFilters';
import { useIncidentList } from '../hooks/useIncidentList';
import { useAuth } from '../../../hooks/useAuth';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { SEVERITY_RANK } from '../../../lib/severity';
import { ROUTES } from '../../../app/routes';
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
        actions={
          <Button asChild>
            <Link to={ROUTES.incidentNew}>
              <Plus aria-hidden="true" />
              {LABELS.incidents.reportAction}
            </Link>
          </Button>
        }
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
              <TextLink to={ROUTES.incidentNew} className="inline-flex items-center gap-1.5">
                <FilePlus className="size-4" aria-hidden="true" />
                {LABELS.incidents.reportTitle}
              </TextLink>
            }
          />
        }
      >
        {(items, footer) => <IncidentTable items={items} footer={footer} />}
      </PagedQuerySection>
    </PageContainer>
  );
}
