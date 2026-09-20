// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Table, TableBody, TableCell, TableRow } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { JobOutcomeBadge } from './JobOutcomeBadge';
import { formatDateTime, formatDuration, formatRelative } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import type { AdminJobRun } from '../../../api/contracts/admin.contract';

type JobRunsTableProps = Readonly<{
  runs: readonly AdminJobRun[];
}>;

const COLUMNS = LABELS.admin.jobRunColumns;

/** Sub-minute runs keep one decimal ("2.4s") — the shared formatter rounds to whole
 * seconds, which would flatten most runs to "0s"/"1s". Longer runs use it as-is. */
function runDuration(startedAt: string, finishedAt: string | null): string {
  if (!finishedAt) return '—';
  const seconds = Math.max(0, (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000);
  if (seconds < 1) return LABELS.admin.jobDurationUnderSecond;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  return formatDuration(seconds);
}

/** §6's idempotency claim is what this table exists to demonstrate live — two
 * consecutive [Run now] rows, the second showing SKIPPED_LOCKED or 0 escalated. */
export function JobRunsTable({ runs }: JobRunsTableProps): ReactElement {
  return (
    <Table isStacked label={LABELS.admin.jobRunsTableLabel}>
      <TableHeader>
        <th>{COLUMNS.startedAt}</th>
        <th>{COLUMNS.outcome}</th>
        <th className="text-right">{COLUMNS.scanned}</th>
        <th className="text-right">{COLUMNS.escalated}</th>
        <th className="text-right">{COLUMNS.notified}</th>
        <th className="text-right">{COLUMNS.duration}</th>
      </TableHeader>
      <TableBody>
        {runs.map((run) => (
          <TableRow key={run.id}>
            <TableCell label={COLUMNS.startedAt} className="whitespace-nowrap">
              <time dateTime={run.startedAt} className="flex flex-col">
                <span className="text-sm text-foreground">{formatRelative(run.startedAt)}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(run.startedAt)}</span>
              </time>
            </TableCell>
            <TableCell label={COLUMNS.outcome}>
              <div className="space-y-1">
                <JobOutcomeBadge outcome={run.outcome} />
                {run.error && <p className="max-w-xs text-xs text-destructive md:line-clamp-2">{run.error}</p>}
              </div>
            </TableCell>
            <TableCell label={COLUMNS.scanned} isNumeric>
              {run.scanned}
            </TableCell>
            <TableCell label={COLUMNS.escalated} isNumeric className={run.escalated > 0 ? 'font-semibold text-foreground' : undefined}>
              {run.escalated}
            </TableCell>
            <TableCell label={COLUMNS.notified} isNumeric>
              {run.notified}
            </TableCell>
            <TableCell label={COLUMNS.duration} isNumeric className="whitespace-nowrap">
              {runDuration(run.startedAt, run.finishedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
