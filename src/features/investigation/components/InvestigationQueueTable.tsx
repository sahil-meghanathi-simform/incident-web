// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableRow } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { StageBadge } from '../../../components/ui/StageBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { formatRelative } from '../../../lib/datetime';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { IncidentListItem } from '../types/investigation.type';

type InvestigationQueueTableProps = Readonly<{
  items: readonly IncidentListItem[];
  /** Pagination, rendered inside the table card. */
  footer?: ReactNode;
}>;

const COLUMNS = LABELS.incidents.columns;

/**
 * No assignee column — every row here is already assigned to the viewer.
 * Same stretched-link row pattern as TriageQueueTable: the whole row is a click
 * target while the link's accessible name stays just the reference.
 */
export function InvestigationQueueTable({ items, footer }: InvestigationQueueTableProps): ReactElement {
  return (
    <Table isStacked footer={footer}>
      <TableHeader>
        <th>{COLUMNS.reference}</th>
        <th>{COLUMNS.title}</th>
        <th>{COLUMNS.severity}</th>
        <th>{COLUMNS.stage}</th>
        <th>{COLUMNS.age}</th>
        <th>
          <span className="sr-only">{COLUMNS.escalation}</span>
        </th>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell label={COLUMNS.reference} isMono>
              <Link
                to={ROUTES.incidentDetail(item.id)}
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
            <TableCell label={COLUMNS.stage}>
              <StageBadge stage={item.stage} />
            </TableCell>
            <TableCell label={COLUMNS.age} className="whitespace-nowrap text-muted-foreground">
              {formatRelative(item.createdAt)}
            </TableCell>
            <TableCell label={COLUMNS.escalation}>
              <EscalationBadge level={item.currentEscalationLevel} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
