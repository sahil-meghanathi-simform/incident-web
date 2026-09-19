import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';
import { ClearanceScopeNotice } from '../components/ClearanceScopeNotice';
import { PeriodPicker } from '../components/PeriodPicker';
import { KpiCardRow } from '../components/KpiCardRow';
import { TypeSeverityMatrix } from '../components/TypeSeverityMatrix';
import { TrendChart } from '../components/TrendChart';
import { EscalationPerformancePanel } from '../components/EscalationPerformancePanel';
import { ExportCsvButton } from '../components/ExportCsvButton';
import { useAnalyticsPeriod } from '../hooks/useAnalyticsPeriod';
import { useAnalyticsOverview } from '../hooks/useAnalyticsOverview';
import { useTypeSeverityMatrix } from '../hooks/useTypeSeverityMatrix';
import { useTrend } from '../hooks/useTrend';
import { useEscalationPerformance } from '../hooks/useEscalationPerformance';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { usePermissions } from '../../../hooks/usePermissions';
import { LABELS } from '../../../lib/labels';

/**
 * Four independent queries (implementation-plan.md §14.2) so a slow trend query never
 * blocks the KPI cards — each section's loading/error/empty state is decided here, one
 * `query.isPending`/`isError`/empty-check at a time, the same discipline
 * IncidentListPage uses for its own single query.
 */
export function AnalyticsPage(): ReactElement {
  useDocumentTitle(LABELS.analytics.pageTitle);
  const { canTriage } = usePermissions();
  const [filters, { setRange, setPreset, setBucket }] = useAnalyticsPeriod();

  const overviewQuery = useAnalyticsOverview(filters);
  const matrixQuery = useTypeSeverityMatrix(filters);
  const trendQuery = useTrend(filters);
  const escalationPerformanceQuery = useEscalationPerformance(filters);

  return (
    <PageContainer>
      <PageHeader
        title={LABELS.analytics.pageTitle}
        description={LABELS.analytics.pageDescription}
        actions={<ExportCsvButton filters={filters} />}
      />

      <ClearanceScopeNotice />

      <PeriodPicker filters={filters} onRangeChange={setRange} onPresetChange={setPreset} onBucketChange={setBucket} />

      {overviewQuery.isPending && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
      {overviewQuery.isError && (
        <div className="mb-6">
          <ErrorState message={LABELS.analytics.loadOverviewError} requestId={overviewQuery.error.requestId} onRetry={() => overviewQuery.refetch()} />
        </div>
      )}
      {overviewQuery.data && <KpiCardRow data={overviewQuery.data} />}

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">{LABELS.analytics.matrixTitle}</h2>
        {matrixQuery.isPending && <SkeletonTable />}
        {matrixQuery.isError && (
          <ErrorState message={LABELS.analytics.matrixLoadError} requestId={matrixQuery.error.requestId} onRetry={() => matrixQuery.refetch()} />
        )}
        {matrixQuery.data && matrixQuery.data.grandTotal === 0 && (
          <EmptyState
            title={LABELS.analytics.matrixEmptyTitle}
            body={LABELS.analytics.matrixEmptyBody}
            action={
              <Button variant="outline" onClick={() => setPreset('90d')}>
                {LABELS.analytics.matrixWidenAction}
              </Button>
            }
          />
        )}
        {matrixQuery.data && matrixQuery.data.grandTotal > 0 && <TypeSeverityMatrix data={matrixQuery.data} />}
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">{LABELS.analytics.trendTitle}</h2>
        {trendQuery.isPending && <SkeletonCard />}
        {trendQuery.isError && (
          <ErrorState message={LABELS.analytics.trendLoadError} requestId={trendQuery.error.requestId} onRetry={() => trendQuery.refetch()} />
        )}
        {trendQuery.data && trendQuery.data.buckets.length === 0 && (
          <EmptyState title={LABELS.analytics.trendEmptyTitle} body={LABELS.analytics.trendEmptyBody} />
        )}
        {trendQuery.data && trendQuery.data.buckets.length > 0 && <TrendChart data={trendQuery.data} />}
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-slate-700">{LABELS.analytics.escalationPerformanceTitle}</h2>
        <p className="mb-2 text-sm text-slate-500">{LABELS.analytics.escalationPerformanceDescription}</p>
        {!canTriage && (
          <div role="status" className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
            {LABELS.analytics.escalationPerformanceForbidden}
          </div>
        )}
        {canTriage && escalationPerformanceQuery.isPending && <SkeletonTable rows={4} columns={5} />}
        {canTriage && escalationPerformanceQuery.isError && (
          <ErrorState
            message={LABELS.analytics.escalationPerformanceLoadError}
            requestId={escalationPerformanceQuery.error.requestId}
            onRetry={() => escalationPerformanceQuery.refetch()}
          />
        )}
        {canTriage && escalationPerformanceQuery.data && escalationPerformanceQuery.data.bySeverity.length === 0 && (
          <EmptyState title={LABELS.analytics.escalationPerformanceEmpty} body={LABELS.analytics.trendEmptyBody} />
        )}
        {canTriage && escalationPerformanceQuery.data && escalationPerformanceQuery.data.bySeverity.length > 0 && (
          <EscalationPerformancePanel data={escalationPerformanceQuery.data} />
        )}
      </section>
    </PageContainer>
  );
}
