// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Activity, Timer } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { RefreshIndicator } from '../../../components/ui/RefreshIndicator';
import { JobRunsTable } from '../components/JobRunsTable';
import { RunJobButton } from '../components/RunJobButton';
import { useJobRuns } from '../hooks/useJobRuns';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { LABELS } from '../../../lib/labels';

export function JobDiagnosticsPage(): ReactElement {
  useDocumentTitle(LABELS.admin.jobDiagnosticsTitle);
  const query = useJobRuns();

  return (
    <PageContainer>
      <PageHeader
        icon={Activity}
        title={LABELS.admin.jobDiagnosticsTitle}
        description={LABELS.admin.jobDiagnosticsDescription}
        actions={<RunJobButton />}
        meta={
          <RefreshIndicator
            isFetching={query.isFetching}
            updatedAt={query.dataUpdatedAt}
            onRefresh={() => void query.refetch()}
            isAutoRefreshing
          />
        }
      />

      {query.isPending && <SkeletonTable columns={6} />}
      {query.isError && !query.data && (
        <ErrorState message={LABELS.admin.loadJobRunsError} onRetry={() => query.refetch()} />
      )}
      {query.data && query.data.runs.length === 0 && (
        <EmptyState icon={Timer} title={LABELS.admin.jobRunsEmptyTitle} body={LABELS.admin.jobRunsEmptyBody} />
      )}
      {/* No BusyRegion here: the 10s poll would dim the table on every tick — the
          RefreshIndicator in the header already shows each background fetch. */}
      {query.data && query.data.runs.length > 0 && <JobRunsTable runs={query.data.runs} />}
    </PageContainer>
  );
}
