// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { BarChart3, Grid3x3, Lock, Timer, TrendingUp } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { BusyRegion } from '../../../components/ui/BusyRegion';
import { Button } from '../../../components/ui/Button';
import { ClearanceScopeNotice } from '../components/ClearanceScopeNotice';
import { AnalyticsToolbar } from '../components/AnalyticsToolbar';
import { KpiCardRow } from '../components/KpiCardRow';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { TypeSeverityMatrix } from '../components/TypeSeverityMatrix';
import { TrendChart } from '../components/TrendChart';
import { TrendChartSkeleton } from '../components/TrendChartSkeleton';
import { EscalationPerformancePanel } from '../components/EscalationPerformancePanel';
import { ExportCsvButton } from '../components/ExportCsvButton';
import { useAnalyticsPeriod } from '../hooks/useAnalyticsPeriod';
import { useAnalyticsOverview } from '../hooks/useAnalyticsOverview';
import { useTypeSeverityMatrix } from '../hooks/useTypeSeverityMatrix';
import { useTrend } from '../hooks/useTrend';
import { useEscalationPerformance } from '../hooks/useEscalationPerformance';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { usePermissions } from '../../../hooks/usePermissions';
import { KPI_GRID_CLASS } from '../lib/kpiGrid';
import { LABELS } from '../../../lib/labels';

const KPI_SKELETONS = ['total', 'open', 'escalated', 'median'] as const;

/**
 * Four independent queries (implementation-plan.md §14.2) so a slow trend query never
 * blocks the KPI cards — each section's loading/error/empty state is decided here, one
 * `query.isPending`/`isError`/empty-check at a time, the same discipline
 * IncidentListPage uses for its own single query. keepPreviousData means a period
 * change dims the stale section (BusyRegion) instead of blanking it.
 */
export function AnalyticsPage(): ReactElement {
  useDocumentTitle(LABELS.analytics.pageTitle);
  const { canTriage } = usePermissions();
  const [filters, actions] = useAnalyticsPeriod();

  const overviewQuery = useAnalyticsOverview(filters);
  const matrixQuery = useTypeSeverityMatrix(filters);
  const trendQuery = useTrend(filters);
  const performanceQuery = useEscalationPerformance(filters);

  return (
    <PageContainer size="wide">
      <PageHeader
        icon={BarChart3}
        title={LABELS.analytics.pageTitle}
        description={LABELS.analytics.pageDescription}
        actions={<ExportCsvButton filters={filters} />}
        meta={<ClearanceScopeNotice />}
      />

      <AnalyticsToolbar filters={filters} actions={actions} />

      <div className="mb-6">
        {overviewQuery.isPending && (
          <div className={KPI_GRID_CLASS}>
            {KPI_SKELETONS.map((key) => (
              <SkeletonCard key={key} variant="stat" />
            ))}
          </div>
        )}
        {overviewQuery.isError && (
          <ErrorState
            message={LABELS.analytics.loadOverviewError}
            requestId={overviewQuery.error.requestId}
            onRetry={() => overviewQuery.refetch()}
          />
        )}
        {overviewQuery.data && (
          <BusyRegion isBusy={overviewQuery.isPlaceholderData}>
            <KpiCardRow data={overviewQuery.data} />
          </BusyRegion>
        )}
      </div>

      <div className="space-y-6">
        <AnalyticsSection title={LABELS.analytics.trendTitle} description={LABELS.analytics.trendDescription} icon={TrendingUp} isBusy={trendQuery.isPlaceholderData}>
          {trendQuery.isPending && <TrendChartSkeleton />}
          {trendQuery.isError && (
            <ErrorState message={LABELS.analytics.trendLoadError} requestId={trendQuery.error.requestId} onRetry={() => trendQuery.refetch()} />
          )}
          {trendQuery.data && trendQuery.data.buckets.length === 0 && (
            <EmptyState size="sm" icon={TrendingUp} title={LABELS.analytics.trendEmptyTitle} body={LABELS.analytics.trendEmptyBody} />
          )}
          {trendQuery.data && trendQuery.data.buckets.length > 0 && <TrendChart data={trendQuery.data} />}
        </AnalyticsSection>

        <AnalyticsSection title={LABELS.analytics.matrixTitle} description={LABELS.analytics.matrixDescription} icon={Grid3x3} isBusy={matrixQuery.isPlaceholderData}>
          {matrixQuery.isPending && <SkeletonTable rows={5} columns={6} />}
          {matrixQuery.isError && (
            <ErrorState message={LABELS.analytics.matrixLoadError} requestId={matrixQuery.error.requestId} onRetry={() => matrixQuery.refetch()} />
          )}
          {matrixQuery.data && matrixQuery.data.grandTotal === 0 && (
            <EmptyState
              size="sm"
              icon={Grid3x3}
              title={LABELS.analytics.matrixEmptyTitle}
              body={LABELS.analytics.matrixEmptyBody}
              action={
                <Button variant="outline" onClick={() => actions.setPreset('90d')}>
                  {LABELS.analytics.matrixWidenAction}
                </Button>
              }
            />
          )}
          {matrixQuery.data && matrixQuery.data.grandTotal > 0 && <TypeSeverityMatrix data={matrixQuery.data} />}
        </AnalyticsSection>

        <AnalyticsSection
          title={LABELS.analytics.escalationPerformanceTitle}
          description={LABELS.analytics.escalationPerformanceDescription}
          icon={Timer}
          isBusy={canTriage && performanceQuery.isPlaceholderData}
        >
          {!canTriage && (
            <Alert role="note" className="flex items-start gap-2.5">
              <Lock aria-hidden="true" />
              <AlertDescription>{LABELS.analytics.escalationPerformanceForbidden}</AlertDescription>
            </Alert>
          )}
          {canTriage && performanceQuery.isPending && <SkeletonTable rows={4} columns={5} />}
          {canTriage && performanceQuery.isError && (
            <ErrorState
              message={LABELS.analytics.escalationPerformanceLoadError}
              requestId={performanceQuery.error.requestId}
              onRetry={() => performanceQuery.refetch()}
            />
          )}
          {canTriage && performanceQuery.data && performanceQuery.data.bySeverity.length === 0 && (
            <EmptyState size="sm" icon={Timer} title={LABELS.analytics.escalationPerformanceEmpty} body={LABELS.analytics.escalationPerformanceEmptyBody} />
          )}
          {canTriage && performanceQuery.data && performanceQuery.data.bySeverity.length > 0 && (
            <EscalationPerformancePanel data={performanceQuery.data} />
          )}
        </AnalyticsSection>
      </div>
    </PageContainer>
  );
}
