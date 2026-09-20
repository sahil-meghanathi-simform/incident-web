// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, FilePlus, Plus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { PagedQuerySection } from '../../../components/ui/PagedQuerySection';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';
import { TextLink } from '../../../components/ui/TextLink';
import { IncidentTable } from '../components/IncidentTable';
import { useMyIncidents } from '../hooks/useMyIncidents';
import { useOffsetPagination } from '../../../hooks/useOffsetPagination';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

export function MyReportsPage(): ReactElement {
  useDocumentTitle(LABELS.incidents.myReportsTitle);
  const { page, setPage } = useOffsetPagination();
  const query = useMyIncidents(page);

  return (
    <PageContainer size="wide">
      <PageHeader
        icon={ClipboardList}
        title={LABELS.incidents.myReportsTitle}
        description={LABELS.incidents.myReportsDescription}
        actions={
          <Button asChild>
            <Link to={ROUTES.incidentNew}>
              <Plus aria-hidden="true" />
              {LABELS.incidents.reportAction}
            </Link>
          </Button>
        }
      />
      <PagedQuerySection
        query={query}
        errorMessage={LABELS.incidents.loadMyReportsError}
        onPageChange={setPage}
        skeletonColumns={8}
        empty={
          <EmptyState
            icon={ClipboardList}
            title={LABELS.incidents.noReportsYetTitle}
            body={LABELS.incidents.noReportsYetBody}
            action={
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
