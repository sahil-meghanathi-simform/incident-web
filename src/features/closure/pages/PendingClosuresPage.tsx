// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { CheckSquare, ClipboardCheck, List } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PagedQuerySection } from '../../../components/ui/PagedQuerySection';
import { TextLink } from '../../../components/ui/TextLink';
import { PendingClosuresTable } from '../components/PendingClosuresTable';
import { useClosuresPending } from '../hooks/useClosuresPending';
import { useOffsetPagination } from '../../../hooks/useOffsetPagination';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

export function PendingClosuresPage(): ReactElement {
  useDocumentTitle(LABELS.closure.pendingQueueTitle);
  const { page, pageSize, setPage } = useOffsetPagination();
  const query = useClosuresPending(page, pageSize);

  return (
    <PageContainer>
      <PageHeader
        icon={CheckSquare}
        title={LABELS.closure.pendingQueueTitle}
        description={LABELS.closure.pendingQueueDescription}
      />
      <PagedQuerySection
        query={query}
        errorMessage={LABELS.closure.loadPendingQueueError}
        onPageChange={setPage}
        skeletonColumns={5}
        empty={
          <EmptyState
            icon={ClipboardCheck}
            title={LABELS.closure.pendingQueueEmptyTitle}
            body={LABELS.closure.pendingQueueEmptyBody}
            action={
              <TextLink to={ROUTES.incidents} className="inline-flex items-center gap-1.5">
                <List className="size-4" aria-hidden="true" />
                {LABELS.closure.pendingQueueEmptyAction}
              </TextLink>
            }
          />
        }
      >
        {(items, footer) => <PendingClosuresTable items={items} footer={footer} />}
      </PagedQuerySection>
    </PageContainer>
  );
}
