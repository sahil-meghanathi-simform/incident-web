// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableRow } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { SlaCountdown } from '../../../components/ui/SlaCountdown';
import { AcknowledgeButton } from '../../triage/components/AcknowledgeButton';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { EscalationFeedItem } from '../types/escalation.type';

type EscalationFeedTableProps = Readonly<{
  items: readonly EscalationFeedItem[];
  /** Rendered inside the table card (the "load more" control). */
  footer?: ReactNode;
}>;

const COLUMNS = LABELS.incidents.columns;
const COPY = LABELS.escalations;

/**
 * One row per actively-escalated incident (escalation.repository.ts's own semantics —
 * not one row per historical EscalationEvent), already sorted level desc, most-overdue
 * first by the API. Acknowledge reuses the exact same mutation/toast as the incident
 * detail page (`features/triage/components/AcknowledgeButton`) rather than a second
 * copy — acknowledging removes the row from this feed (useAcknowledgeIncident
 * invalidates queryKeys.escalations.feed).
 *
 * The reference link stretches over the whole row (`after:inset-0`), so the entire
 * row is a click target while the link's accessible name stays just the reference;
 * the Acknowledge button sits above that overlay (`relative z-10`).
 */
export function EscalationFeedTable({ items, footer }: EscalationFeedTableProps): ReactElement {
  return (
    <Table isStacked footer={footer}>
      <TableHeader>
        <th scope="col">{COLUMNS.reference}</th>
        <th scope="col">{COLUMNS.title}</th>
        <th scope="col">{COLUMNS.severity}</th>
        <th scope="col">{COPY.columnLevel}</th>
        <th scope="col">{COLUMNS.assignee}</th>
        <th scope="col">{COPY.columnSla}</th>
        <th scope="col">
          <span className="sr-only">{COPY.columnActions}</span>
        </th>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.incidentId}>
            <TableCell label={COLUMNS.reference} isMono>
              <Link
                to={ROUTES.incidentDetail(item.incidentId)}
                className="font-medium text-primary after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring"
              >
                {item.incidentReference}
              </Link>
            </TableCell>
            <TableCell label={COLUMNS.title} isWide className="max-w-xs font-medium text-foreground md:truncate">
              {item.incidentTitle}
            </TableCell>
            <TableCell label={COLUMNS.severity}>
              <SeverityBadge severity={item.severity} />
            </TableCell>
            <TableCell label={COPY.columnLevel}>
              <EscalationBadge level={item.level} />
            </TableCell>
            <TableCell label={COLUMNS.assignee}>{item.assignedInvestigator?.displayName ?? '—'}</TableCell>
            <TableCell label={COPY.columnSla} className="whitespace-nowrap">
              <SlaCountdown dueAt={item.dueAt} />
            </TableCell>
            <TableCell isWide className="md:text-right">
              <AcknowledgeButton incidentId={item.incidentId} version={item.version} size="sm" className="relative z-10" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
