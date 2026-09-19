import type { ReactElement } from 'react';
import { Table } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { Badge } from '../../../components/ui/Badge';
import { formatDateTime } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import type { AdminJobRun } from '../../../api/contracts/admin.contract';

type JobRunsTableProps = Readonly<{
  runs: readonly AdminJobRun[];
}>;

const OUTCOME_CLASS: Record<string, string> = {
  COMPLETED: 'border-green-300 bg-green-50 text-green-700',
  SKIPPED_LOCKED: 'border-amber-300 bg-amber-50 text-amber-700',
  FAILED: 'border-red-300 bg-red-50 text-red-700',
};

function formatDuration(startedAt: string, finishedAt: string | null): string {
  if (!finishedAt) return '—';
  const seconds = Math.max(0, (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000);
  return seconds < 1 ? '<1s' : `${seconds.toFixed(1)}s`;
}

/** §6's idempotency claim is what this table exists to demonstrate live — two
 * consecutive [Run now] rows, the second showing SKIPPED_LOCKED or 0 escalated. */
export function JobRunsTable({ runs }: JobRunsTableProps): ReactElement {
  return (
    <Table>
      <TableHeader>
        <th className="px-4 py-2">{LABELS.admin.jobRunColumns.startedAt}</th>
        <th className="px-4 py-2">{LABELS.admin.jobRunColumns.outcome}</th>
        <th className="px-4 py-2">{LABELS.admin.jobRunColumns.scanned}</th>
        <th className="px-4 py-2">{LABELS.admin.jobRunColumns.escalated}</th>
        <th className="px-4 py-2">{LABELS.admin.jobRunColumns.notified}</th>
        <th className="px-4 py-2">{LABELS.admin.jobRunColumns.duration}</th>
      </TableHeader>
      <tbody className="divide-y divide-border">
        {runs.map((run) => (
          <tr key={run.id} className="hover:bg-accent">
            <td className="whitespace-nowrap px-4 py-2 text-xs text-muted-foreground">{formatDateTime(run.startedAt)}</td>
            <td className="px-4 py-2">
              {run.outcome ? (
                <Badge className={OUTCOME_CLASS[run.outcome] ?? 'border-border bg-muted text-foreground-soft'}>
                  {run.outcome.replaceAll('_', ' ')}
                </Badge>
              ) : (
                <Badge className="border-border bg-muted text-muted-foreground">RUNNING</Badge>
              )}
            </td>
            <td className="px-4 py-2 text-foreground-soft">{run.scanned}</td>
            <td className="px-4 py-2 text-foreground-soft">{run.escalated}</td>
            <td className="px-4 py-2 text-foreground-soft">{run.notified}</td>
            <td className="px-4 py-2 text-foreground-soft">{formatDuration(run.startedAt, run.finishedAt)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
