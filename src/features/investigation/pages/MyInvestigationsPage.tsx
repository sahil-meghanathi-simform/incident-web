// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { FileSearch, List, Search } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PagedQuerySection } from '../../../components/ui/PagedQuerySection';
import { TextLink } from '../../../components/ui/TextLink';
import { InvestigationQueueTable } from '../components/InvestigationQueueTable';
import { useMyInvestigations } from '../hooks/useMyInvestigations';
import { useOffsetPagination } from '../../../hooks/useOffsetPagination';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

export function MyInvestigationsPage(): ReactElement {
  useDocumentTitle(LABELS.investigation.myInvestigationsTitle);
  const { page, pageSize, setPage } = useOffsetPagination();
  const query = useMyInvestigations(page, pageSize);

  return (
    <PageContainer>
      <PageHeader
        icon={Search}
        title={LABELS.investigation.myInvestigationsTitle}
        description={LABELS.investigation.myInvestigationsDescription}
      />
      <PagedQuerySection
        query={query}
        errorMessage={LABELS.investigation.loadMyInvestigationsError}
        onPageChange={setPage}
        skeletonColumns={6}
        empty={
          <EmptyState
            icon={FileSearch}
            title={LABELS.investigation.noInvestigationsTitle}
            body={LABELS.investigation.noInvestigationsBody}
            action={
              <TextLink to={ROUTES.incidents} className="inline-flex items-center gap-1.5">
                <List className="size-4" aria-hidden="true" />
                {LABELS.investigation.noInvestigationsAction}
              </TextLink>
            }
          />
        }
      >
        {(items, footer) => <InvestigationQueueTable items={items} footer={footer} />}
      </PagedQuerySection>
    </PageContainer>
  );
}
