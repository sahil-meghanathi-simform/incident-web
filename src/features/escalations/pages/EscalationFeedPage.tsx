// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { CheckCircle2, Siren } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadMore } from '../../../components/ui/LoadMore';
import { Badge } from '../../../components/ui/Badge';
import { RefreshIndicator } from '../../../components/ui/RefreshIndicator';
import { EscalationFeedTable } from '../components/EscalationFeedTable';
import { TierThresholdsPanel } from '../components/TierThresholdsPanel';
import { useEscalationFeed } from '../hooks/useEscalationFeed';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { LABELS } from '../../../lib/labels';

/**
 * Role-open (any authenticated actor), scoped purely by clearance — matches
 * `/incidents` itself and the S2 fix in docs/escalation.md. Cursor/infinite, same
 * pattern as the Notes tab (`NotesPanel`), since the API is cursor-paginated too.
 */
export function EscalationFeedPage(): ReactElement {
  useDocumentTitle(LABELS.escalations.feedTitle);
  const query = useEscalationFeed();

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const hasMore = query.data?.pages.at(-1)?.hasMore ?? false;

  return (
    <PageContainer size="wide">
      <PageHeader
        icon={Siren}
        title={LABELS.escalations.feedTitle}
        description={LABELS.escalations.feedDescription}
        meta={
          query.isSuccess ? (
            <>
              <Badge tone={items.length > 0 ? 'danger' : 'success'}>{LABELS.escalations.feedCount(items.length, hasMore)}</Badge>
              <RefreshIndicator
                isFetching={query.isFetching && !query.isFetchingNextPage}
                updatedAt={query.dataUpdatedAt}
                onRefresh={() => void query.refetch()}
              />
            </>
          ) : undefined
        }
      />

      {query.isPending && <SkeletonTable columns={7} />}

      {query.isError && <ErrorState message={LABELS.escalations.loadFeedError} requestId={query.error.requestId} onRetry={() => query.refetch()} />}

      {query.isSuccess && items.length === 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-3">
            <EmptyState icon={CheckCircle2} title={LABELS.escalations.feedEmptyTitle} body={LABELS.escalations.feedEmptyBody} />
          </div>
          <TierThresholdsPanel className="lg:col-span-2" />
        </div>
      )}

      {items.length > 0 && (
        <EscalationFeedTable
          items={items}
          footer={<LoadMore hasMore={hasMore} isLoading={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()} />}
        />
      )}
    </PageContainer>
  );
}
