import type { ReactElement } from 'react';
import { Table } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import type { EscalationPerformanceResponse } from '../../../api/contracts/analytics.contract';
import { formatDuration } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';

type EscalationPerformancePanelProps = Readonly<{ data: EscalationPerformanceResponse }>;

/** The table only — AnalyticsPage decides between this, the forbidden notice, the
 * loading skeleton, and the empty state (same discipline as IncidentListPage). */
export function EscalationPerformancePanel({ data }: EscalationPerformancePanelProps): ReactElement {
  return (
    <Table>
      <TableHeader>
        <th scope="col" className="px-3 py-2">
          {LABELS.analytics.escalationColumns.severity}
        </th>
        <th scope="col" className="px-3 py-2 text-right">
          {LABELS.analytics.escalationColumns.escalatedCount}
        </th>
        <th scope="col" className="px-3 py-2 text-right">
          {LABELS.analytics.escalationColumns.acknowledgedCount}
        </th>
        <th scope="col" className="px-3 py-2 text-right">
          {LABELS.analytics.escalationColumns.medianAck}
        </th>
        <th scope="col" className="px-3 py-2 text-right">
          {LABELS.analytics.escalationColumns.p90Ack}
        </th>
      </TableHeader>
      <tbody className="divide-y divide-slate-100">
        {data.bySeverity.map((row) => (
          <tr key={row.severity}>
            <td className="px-3 py-2">
              <SeverityBadge severity={row.severity} />
            </td>
            <td className="px-3 py-2 text-right">{row.escalatedCount}</td>
            <td className="px-3 py-2 text-right">{row.acknowledgedCount}</td>
            <td className="px-3 py-2 text-right">
              {row.medianAckSeconds === null ? LABELS.analytics.kpiNoData : formatDuration(row.medianAckSeconds)}
            </td>
            <td className="px-3 py-2 text-right">
              {row.p90AckSeconds === null ? LABELS.analytics.kpiNoData : formatDuration(row.p90AckSeconds)}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
