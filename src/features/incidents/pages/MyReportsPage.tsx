// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ClipboardList, FilePlus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { PagedQuerySection } from '../../../components/ui/PagedQuerySection';
import { EmptyState } from '../../../components/ui/EmptyState';
import { IncidentTable } from '../components/IncidentTable';
import { ReportIncidentButton } from '../components/ReportIncidentButton';
import { useMyIncidents } from '../hooks/useMyIncidents';
import { useOffsetPagination } from '../../../hooks/useOffsetPagination';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
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
        actions={<ReportIncidentButton />}
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
            action={<ReportIncidentButton variant="link" icon={FilePlus} label={LABELS.incidents.reportTitle} />}
          />
        }
      >
        {(items, footer) => <IncidentTable items={items} footer={footer} />}
      </PagedQuerySection>
    </PageContainer>
  );
}
