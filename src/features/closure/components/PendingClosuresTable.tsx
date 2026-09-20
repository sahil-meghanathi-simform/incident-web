// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableRow } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { formatRelative } from '../../../lib/datetime';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { IncidentListItem } from '../../incidents/types/incident.type';

type PendingClosuresTableProps = Readonly<{
  items: readonly IncidentListItem[];
  /** Pagination, rendered inside the table card. */
  footer?: ReactNode;
}>;

const COLUMNS = LABELS.incidents.columns;

/** Every row links straight into the incident's Closure tab (`?tab=closure`) — the
 * queue is a navigation surface into the same review screen the assignee sees, not a
 * separate approve/reject UI of its own. The "Proposed" column reads `updatedAt`:
 * proposing closure is the last write a PENDING_CLOSURE incident receives. */
export function PendingClosuresTable({ items, footer }: PendingClosuresTableProps): ReactElement {
  return (
    <Table isStacked footer={footer}>
      <TableHeader>
        <th>{COLUMNS.reference}</th>
        <th>{COLUMNS.title}</th>
        <th>{COLUMNS.severity}</th>
        <th>{COLUMNS.assignee}</th>
        <th>{LABELS.closure.proposedColumn}</th>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell label={COLUMNS.reference} isMono>
              <Link
                to={`${ROUTES.incidentDetail(item.id)}?tab=closure`}
                className="font-medium text-primary after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring"
              >
                {item.reference}
              </Link>
            </TableCell>
            <TableCell label={COLUMNS.title} isWide className="max-w-xs font-medium text-foreground md:truncate">
              {item.title}
            </TableCell>
            <TableCell label={COLUMNS.severity}>
              <SeverityBadge severity={item.severity} />
            </TableCell>
            <TableCell label={COLUMNS.assignee}>{item.assignedInvestigator?.displayName ?? '—'}</TableCell>
            <TableCell label={LABELS.closure.proposedColumn} className="whitespace-nowrap text-muted-foreground">
              {formatRelative(item.updatedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
