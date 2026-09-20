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
import type { IncidentListItem } from '../types/incident.type';

type IncidentTableProps = Readonly<{
  items: readonly IncidentListItem[];
  /** Pagination, rendered inside the table card. */
  footer?: ReactNode;
}>;

const COLUMNS = LABELS.incidents.columns;

/**
 * Stacks into labelled cards below `md`. The reference link stretches over the whole
 * row (`after:inset-0`) so the entire row is a click target while the link's
 * accessible name stays exactly the reference — rows themselves are never wrapped in
 * links.
 */
export function IncidentTable({ items, footer }: IncidentTableProps): ReactElement {
  return (
    <Table isStacked minWidth="lg" footer={footer}>
      <TableHeader>
        <th>{COLUMNS.reference}</th>
        <th>{COLUMNS.title}</th>
        <th>{COLUMNS.type}</th>
        <th>{COLUMNS.severity}</th>
        <th>{COLUMNS.stage}</th>
        <th>{COLUMNS.assignee}</th>
        <th>{COLUMNS.age}</th>
        <th>
          <span className="sr-only">{COLUMNS.escalation}</span>
        </th>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell label={COLUMNS.reference} isMono className="whitespace-nowrap">
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
            <TableCell label={COLUMNS.type} className="capitalize md:whitespace-nowrap">
              {LABELS.incidents.typeName(item.type).toLowerCase()}
            </TableCell>
            <TableCell label={COLUMNS.severity}>
              <SeverityBadge severity={item.severity} />
            </TableCell>
            <TableCell label={COLUMNS.stage}>
              <StageBadge stage={item.stage} />
            </TableCell>
            <TableCell label={COLUMNS.assignee}>{item.assignedInvestigator?.displayName ?? '—'}</TableCell>
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
