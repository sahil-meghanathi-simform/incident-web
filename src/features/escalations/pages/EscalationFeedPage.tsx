import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadMore } from '../../../components/ui/LoadMore';
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
    <PageContainer>
      <PageHeader title={LABELS.escalations.feedTitle} description={LABELS.escalations.feedDescription} />

      {query.isPending && <SkeletonTable />}

      {query.isError && <ErrorState message={LABELS.escalations.loadFeedError} onRetry={() => query.refetch()} />}

      {query.isSuccess && items.length === 0 && (
        <EmptyState
          title={LABELS.escalations.feedEmptyTitle}
          body={LABELS.escalations.feedEmptyBody}
          action={<TierThresholdsPanel />}
        />
      )}

      {items.length > 0 && (
        <div className="space-y-3">
          <EscalationFeedTable items={items} />
          <LoadMore hasMore={hasMore} isLoading={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()} />
        </div>
      )}
    </PageContainer>
  );
}
