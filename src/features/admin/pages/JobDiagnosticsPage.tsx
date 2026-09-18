import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
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
        title={LABELS.admin.jobDiagnosticsTitle}
        description={LABELS.admin.jobDiagnosticsDescription}
        actions={<RunJobButton />}
      />

      {query.isPending && <SkeletonTable columns={6} />}
      {query.isError && <ErrorState message={LABELS.admin.loadJobRunsError} onRetry={() => query.refetch()} />}
      {query.data && query.data.runs.length === 0 && (
        <EmptyState title={LABELS.admin.jobRunsEmptyTitle} body={LABELS.admin.jobRunsEmptyBody} />
      )}
      {query.data && query.data.runs.length > 0 && <JobRunsTable runs={query.data.runs} />}
    </PageContainer>
  );
}
