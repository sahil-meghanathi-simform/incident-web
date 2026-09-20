// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Bell, BellOff, CloudOff } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Badge } from '../../../components/ui/Badge';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { RefreshIndicator } from '../../../components/ui/RefreshIndicator';
import { NotificationInbox } from '../components/NotificationInbox';
import { useNotifications } from '../hooks/useNotifications';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { LABELS } from '../../../lib/labels';

const SKELETON_ROWS = ['a', 'b', 'c', 'd', 'e'] as const;

/** Polled every 60s by useNotifications (shared with the bell). The list itself —
 * filter, mark-as-read, day groups, its own scrolling — is NotificationInbox; this
 * page owns the header and the loading / error / empty states around it. A poll
 * failure with data already on screen degrades to a notice, never a blank page. */
export function NotificationsPage(): ReactElement {
  useDocumentTitle(LABELS.notifications.pageTitle);
  const query = useNotifications();

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const hasMore = query.data?.pages.at(-1)?.hasMore ?? false;
  const unreadCount = query.data?.pages[0]?.unreadCount ?? 0;

  return (
    <PageContainer size="narrow" isFullHeight>
      <PageHeader
        icon={Bell}
        title={LABELS.notifications.pageTitle}
        description={LABELS.notifications.pageDescription}
        meta={
          query.data ? (
            <>
              <Badge tone={unreadCount > 0 ? 'primary' : 'success'} dotClassName={unreadCount > 0 ? 'bg-primary' : 'bg-success'}>
                {unreadCount > 0 ? LABELS.notifications.unreadBadgeLabel(unreadCount) : LABELS.notifications.allCaughtUp}
              </Badge>
              <RefreshIndicator
                isAutoRefreshing
                isFetching={query.isFetching && !query.isFetchingNextPage}
                updatedAt={query.dataUpdatedAt}
                onRefresh={() => void query.refetch()}
              />
            </>
          ) : undefined
        }
      />

      {query.isPending && (
        <Card variant="elevated" className="divide-y divide-border overflow-hidden">
          {SKELETON_ROWS.map((row) => (
            <SkeletonCard key={row} variant="list-item" className="rounded-none border-0" />
          ))}
        </Card>
      )}

      {query.isError && !query.data && (
        <ErrorState message={LABELS.notifications.loadError} requestId={query.error.requestId} onRetry={() => query.refetch()} />
      )}

      {query.isError && query.data && (
        <Alert variant="warning" role="status" className="mb-4 flex items-start gap-2.5">
          <CloudOff aria-hidden="true" />
          <AlertDescription>{LABELS.notifications.updateFailed}</AlertDescription>
        </Alert>
      )}

      {query.isSuccess && items.length === 0 && (
        <EmptyState icon={BellOff} title={LABELS.notifications.emptyTitle} body={LABELS.notifications.emptyBody} />
      )}

      {items.length > 0 && (
        <NotificationInbox
          items={items}
          unreadCount={unreadCount}
          hasMore={hasMore}
          isLoadingMore={query.isFetchingNextPage}
          onLoadMore={() => void query.fetchNextPage()}
        />
      )}
    </PageContainer>
  );
}
