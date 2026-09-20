// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { FolderOpen, Layers, Siren, Timer } from 'lucide-react';
import type { AnalyticsOverviewResponse } from '../../../api/contracts/analytics.contract';
import { KpiCard } from './KpiCard';
import { formatDuration } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import { KPI_GRID_CLASS } from '../lib/kpiGrid';

type KpiCardRowProps = Readonly<{ data: AnalyticsOverviewResponse }>;

/** "42% of total" — omitted when there is no total to take a share of. */
function shareOfTotal(count: number, total: number): string | undefined {
  return total > 0 ? LABELS.analytics.kpiShareOfTotal(Math.round((count / total) * 100)) : undefined;
}

export function KpiCardRow({ data }: KpiCardRowProps): ReactElement {
  const hints = LABELS.analytics.kpiHints;
  // exactOptionalPropertyTypes: an absent footnote must be an absent prop, not `undefined`.
  const openShare = shareOfTotal(data.openIncidents, data.totalIncidents);
  const escalatedShare = shareOfTotal(data.escalatedIncidents, data.totalIncidents);
  return (
    <div className={KPI_GRID_CLASS}>
      <KpiCard
        label={LABELS.analytics.kpiTotal}
        value={String(data.totalIncidents)}
        hint={hints.total}
        icon={Layers}
        footnote={LABELS.analytics.kpiInPeriod}
      />
      <KpiCard
        label={LABELS.analytics.kpiOpen}
        value={String(data.openIncidents)}
        hint={hints.open}
        icon={FolderOpen}
        tone="info"
        {...(openShare ? { footnote: openShare } : {})}
      />
      <KpiCard
        label={LABELS.analytics.kpiEscalated}
        value={String(data.escalatedIncidents)}
        hint={hints.escalated}
        icon={Siren}
        tone="warning"
        {...(escalatedShare ? { footnote: escalatedShare } : {})}
      />
      <KpiCard
        label={LABELS.analytics.kpiMedianAck}
        value={data.medianAckSeconds === null ? LABELS.analytics.kpiNoData : formatDuration(data.medianAckSeconds)}
        hint={hints.medianAck}
        icon={Timer}
        tone="success"
        footnote={LABELS.analytics.kpiAcknowledgedOnly}
      />
    </div>
  );
}
