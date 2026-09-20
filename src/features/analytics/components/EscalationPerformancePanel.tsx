// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Table, TableBody, TableCell, TableRow } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import type { EscalationPerformanceResponse } from '../../../api/contracts/analytics.contract';
import { formatDuration } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';

type EscalationPerformancePanelProps = Readonly<{ data: EscalationPerformanceResponse }>;

const COLUMNS = LABELS.analytics.escalationColumns;

function durationOrDash(seconds: number | null): string {
  return seconds === null ? LABELS.analytics.kpiNoData : formatDuration(seconds);
}

/** The table only — AnalyticsPage decides between this, the forbidden notice, the
 * loading skeleton, and the empty state (same discipline as IncidentListPage). */
export function EscalationPerformancePanel({ data }: EscalationPerformancePanelProps): ReactElement {
  return (
    <Table isStacked minWidth="sm">
      <TableHeader>
        <th scope="col">{COLUMNS.severity}</th>
        <th scope="col" className="text-right">
          {COLUMNS.escalatedCount}
        </th>
        <th scope="col" className="text-right">
          {COLUMNS.acknowledgedCount}
        </th>
        <th scope="col" className="text-right">
          {COLUMNS.medianAck}
        </th>
        <th scope="col" className="text-right">
          {COLUMNS.p90Ack}
        </th>
      </TableHeader>
      <TableBody>
        {data.bySeverity.map((row) => (
          <TableRow key={row.severity}>
            <TableCell label={COLUMNS.severity} isWide>
              <SeverityBadge severity={row.severity} />
            </TableCell>
            <TableCell label={COLUMNS.escalatedCount} isNumeric>
              {row.escalatedCount}
            </TableCell>
            <TableCell label={COLUMNS.acknowledgedCount} isNumeric>
              {row.acknowledgedCount}
            </TableCell>
            <TableCell label={COLUMNS.medianAck} isNumeric className="font-medium text-foreground">
              {durationOrDash(row.medianAckSeconds)}
            </TableCell>
            <TableCell label={COLUMNS.p90Ack} isNumeric>
              {durationOrDash(row.p90AckSeconds)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
