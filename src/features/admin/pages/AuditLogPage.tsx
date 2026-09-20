// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { FilterX, ScrollText, SearchX } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';
import { PagedQuerySection } from '../../../components/ui/PagedQuerySection';
import { Badge } from '../../../components/ui/Badge';
import { RefreshIndicator } from '../../../components/ui/RefreshIndicator';
import { AuditFilters } from '../components/AuditFilters';
import { AuditTable } from '../components/AuditTable';
import { useAuditFilters } from '../hooks/useAuditFilters';
import { useAuditSearch } from '../hooks/useAuditSearch';
import { CLEAR_AUDIT_FILTERS_PATCH, hasAnyAuditFilter } from '../schemas/auditFilterPatches';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { LABELS } from '../../../lib/labels';

export function AuditLogPage(): ReactElement {
  useDocumentTitle(LABELS.admin.auditLogTitle);
  const [filters, setFilters] = useAuditFilters();
  const query = useAuditSearch(filters);
  const hasAnyFilter = hasAnyAuditFilter(filters);

  return (
    <PageContainer size="wide">
      <PageHeader
        icon={ScrollText}
        title={LABELS.admin.auditLogTitle}
        description={LABELS.admin.auditLogDescription}
        meta={
          query.data ? (
            <>
              {/* The count follows the filters, so it doubles as "how many matched". */}
              <Badge tone={hasAnyFilter ? 'primary' : 'neutral'}>{LABELS.admin.auditTotal(query.data.totalItems)}</Badge>
              <RefreshIndicator isFetching={query.isFetching} updatedAt={query.dataUpdatedAt} onRefresh={() => void query.refetch()} />
            </>
          ) : undefined
        }
      />

      <AuditFilters filters={filters} onChange={setFilters} />

      <PagedQuerySection
        query={query}
        errorMessage={LABELS.admin.loadAuditError}
        onPageChange={(page) => setFilters({ page })}
        skeletonColumns={6}
        empty={
          <EmptyState
            icon={hasAnyFilter ? SearchX : ScrollText}
            title={LABELS.admin.auditEmptyTitle}
            body={hasAnyFilter ? LABELS.admin.auditEmptyBody : LABELS.admin.auditEmptyUnfilteredBody}
            action={
              hasAnyFilter ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(CLEAR_AUDIT_FILTERS_PATCH)}
                >
                  <FilterX aria-hidden="true" />
                  {LABELS.admin.clearFilters}
                </Button>
              ) : undefined
            }
          />
        }
      >
        {(items, footer) => <AuditTable items={items} footer={footer} />}
      </PagedQuerySection>
    </PageContainer>
  );
}
