import type { ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useIncidentSummary } from '../../incidents/hooks/useIncidentSummary';
import { STAGE_ORDER, STAGE_LABEL } from '../../../lib/stage';
import { LABELS } from '../../../lib/labels';

/** Composite shared component: owns its own query, like NotificationBell. */
export function StageSummaryCard(): ReactElement {
  const query = useIncidentSummary();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{LABELS.dashboard.byStageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {query.isPending && (
          <div role="status" className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {STAGE_ORDER.map((stage) => (
              <Skeleton key={stage} className="h-14 w-full" />
            ))}
            <span className="sr-only">Loading…</span>
          </div>
        )}
        {query.isError && <ErrorState message={LABELS.dashboard.loadSummaryError} onRetry={() => query.refetch()} />}
        {query.data && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {STAGE_ORDER.map((stage) => (
              <div key={stage} className="rounded-md border border-border bg-muted p-3">
                <p className="font-display text-2xl font-semibold tabular-nums text-foreground">
                  {query.data.counts[stage] ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">{STAGE_LABEL[stage]}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
