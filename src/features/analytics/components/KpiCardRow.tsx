import type { ReactElement } from 'react';
import type { AnalyticsOverviewResponse } from '../../../api/contracts/analytics.contract';
import { formatDuration } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';

type KpiCardRowProps = Readonly<{ data: AnalyticsOverviewResponse }>;

function KpiCard({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
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
