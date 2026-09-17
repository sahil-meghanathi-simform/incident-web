import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { TablePagination } from '../../../components/ui/TablePagination';
import { TextLink } from '../../../components/ui/TextLink';
import { TriageQueueTable } from '../components/TriageQueueTable';
import { useTriageQueue } from '../hooks/useTriageQueue';
import { useOffsetPagination } from '../../../hooks/useOffsetPagination';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { cn } from '../../../lib/cn';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

export function TriageQueuePage(): ReactElement {
  useDocumentTitle(LABELS.triage.queueTitle);
  const { page, pageSize, setPage } = useOffsetPagination();
  const query = useTriageQueue(page, pageSize);

  return (
    <PageContainer>
      <PageHeader title={LABELS.triage.queueTitle} description={LABELS.triage.queueDescription} />

      {query.isPending && <SkeletonTable />}
      {query.isError && <ErrorState message={LABELS.triage.loadQueueError} onRetry={() => query.refetch()} />}
      {query.data && query.data.items.length === 0 && (
        <EmptyState
          title={LABELS.triage.queueEmptyTitle}
          body={LABELS.triage.queueEmptyBody}
          action={<TextLink to={ROUTES.incidents}>{LABELS.triage.viewFullList}</TextLink>}
        />
      )}
      {query.data && query.data.items.length > 0 && (
        <div className={cn(query.isPlaceholderData && 'opacity-60 transition-opacity')}>
          <TriageQueueTable items={query.data.items} />
          <TablePagination page={query.data.page} totalPages={query.data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
