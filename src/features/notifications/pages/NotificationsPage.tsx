import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadMore } from '../../../components/ui/LoadMore';
import { NotificationItem } from '../components/NotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { LABELS } from '../../../lib/labels';

export function NotificationsPage(): ReactElement {
  useDocumentTitle(LABELS.notifications.pageTitle);
  const query = useNotifications();

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const hasMore = query.data?.pages.at(-1)?.hasMore ?? false;

  return (
    <PageContainer>
      <PageHeader title={LABELS.notifications.pageTitle} description={LABELS.notifications.pageDescription} />

      {query.isPending && (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {query.isError && !query.data && <ErrorState message={LABELS.notifications.loadError} onRetry={() => query.refetch()} />}

      {query.isSuccess && items.length === 0 && (
        <EmptyState title={LABELS.notifications.emptyTitle} body={LABELS.notifications.emptyBody} />
      )}

      {items.length > 0 && (
        <div className="space-y-3">
          <ul className="space-y-2">
            {items.map((item) => (
              <NotificationItem key={item.id} notification={item} />
            ))}
          </ul>
          <LoadMore hasMore={hasMore} isLoading={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()} />
        </div>
      )}
    </PageContainer>
  );
}
