import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { StageBadge } from '../../../components/ui/StageBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { formatRelative } from '../../../lib/datetime';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { IncidentListItem } from '../../incidents/types/incident.type';

type TriageQueueTableProps = Readonly<{
  items: readonly IncidentListItem[];
}>;

/**
 * A live per-row SLA countdown needs the tier thresholds and each incident's
 * `highSeveritySince`, neither of which is fetchable yet — that's Module 7
 * (Escalation). `currentEscalationLevel` (via EscalationBadge) is the closest signal
 * this module can show honestly; the countdown itself lands with the escalation feed.
 */
export function TriageQueueTable({ items }: TriageQueueTableProps): ReactElement {
  return (
    <Table>
      <TableHeader>
        <th className="px-4 py-2">{LABELS.incidents.columns.reference}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.title}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.severity}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.stage}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.assignee}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.age}</th>
        <th className="px-4 py-2" />
      </TableHeader>
      <tbody className="divide-y divide-border">
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-accent">
            <td className="px-4 py-2 font-mono text-xs text-foreground-soft">
              <Link to={ROUTES.incidentDetail(item.id)} className="text-primary hover:underline">
                {item.reference}
              </Link>
            </td>
            <td className="max-w-xs truncate px-4 py-2 text-foreground">{item.title}</td>
            <td className="px-4 py-2">
              <SeverityBadge severity={item.severity} />
            </td>
            <td className="px-4 py-2">
              <StageBadge stage={item.stage} />
            </td>
            <td className="px-4 py-2 text-foreground-soft">{item.assignedInvestigator?.displayName ?? '—'}</td>
            <td className="px-4 py-2 text-muted-foreground">{formatRelative(item.createdAt)}</td>
            <td className="px-4 py-2">
              <EscalationBadge level={item.currentEscalationLevel} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
