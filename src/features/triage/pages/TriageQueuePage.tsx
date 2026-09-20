// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { CheckCircle2, Inbox, List } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PagedQuerySection } from '../../../components/ui/PagedQuerySection';
import { TextLink } from '../../../components/ui/TextLink';
import { TriageQueueTable } from '../components/TriageQueueTable';
import { useTriageQueue } from '../hooks/useTriageQueue';
import { useOffsetPagination } from '../../../hooks/useOffsetPagination';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

export function TriageQueuePage(): ReactElement {
  useDocumentTitle(LABELS.triage.queueTitle);
  const { page, pageSize, setPage } = useOffsetPagination();
  const query = useTriageQueue(page, pageSize);

  return (
    <PageContainer>
      <PageHeader icon={Inbox} title={LABELS.triage.queueTitle} description={LABELS.triage.queueDescription} />
      <PagedQuerySection
        query={query}
        errorMessage={LABELS.triage.loadQueueError}
        onPageChange={setPage}
        skeletonColumns={7}
        empty={
          <EmptyState
            icon={CheckCircle2}
            title={LABELS.triage.queueEmptyTitle}
            body={LABELS.triage.queueEmptyBody}
            action={
              <TextLink to={ROUTES.incidents} className="inline-flex items-center gap-1.5">
                <List className="size-4" aria-hidden="true" />
                {LABELS.triage.viewFullList}
              </TextLink>
            }
          />
        }
      >
        {(items, footer) => <TriageQueueTable items={items} footer={footer} />}
      </PagedQuerySection>
    </PageContainer>
  );
}
