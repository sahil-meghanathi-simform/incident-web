import type { ReactElement } from 'react';
import type { AnalyticsOverviewResponse } from '../../../api/contracts/analytics.contract';
import { Card } from '../../../components/ui/Card';
import { formatDuration } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';

type KpiCardRowProps = Readonly<{ data: AnalyticsOverviewResponse }>;

function KpiCard({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-caps text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">{value}</p>
    </Card>
  );
}

export function KpiCardRow({ data }: KpiCardRowProps): ReactElement {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <KpiCard label={LABELS.analytics.kpiTotal} value={String(data.totalIncidents)} />
      <KpiCard label={LABELS.analytics.kpiOpen} value={String(data.openIncidents)} />
      <KpiCard label={LABELS.analytics.kpiEscalated} value={String(data.escalatedIncidents)} />
      <KpiCard
        label={LABELS.analytics.kpiMedianAck}
        value={data.medianAckSeconds === null ? LABELS.analytics.kpiNoData : formatDuration(data.medianAckSeconds)}
      />
    </div>
  );
}
