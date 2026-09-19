import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { formatRelative } from '../../../lib/datetime';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { IncidentListItem } from '../../incidents/types/incident.type';

type PendingClosuresTableProps = Readonly<{
  items: readonly IncidentListItem[];
}>;

/** Every row links straight into the incident's Closure tab (`?tab=closure`) — the
 * queue is a navigation surface into the same review screen the assignee sees, not a
 * separate approve/reject UI of its own. */
export function PendingClosuresTable({ items }: PendingClosuresTableProps): ReactElement {
  return (
    <Table>
      <TableHeader>
        <th className="px-4 py-2">{LABELS.incidents.columns.reference}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.title}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.severity}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.assignee}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.age}</th>
      </TableHeader>
      <tbody className="divide-y divide-border">
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-accent">
            <td className="px-4 py-2 font-mono text-xs text-foreground-soft">
              <Link to={`${ROUTES.incidentDetail(item.id)}?tab=closure`} className="text-primary hover:underline">
                {item.reference}
              </Link>
            </td>
            <td className="max-w-xs truncate px-4 py-2 text-foreground">{item.title}</td>
            <td className="px-4 py-2">
              <SeverityBadge severity={item.severity} />
            </td>
            <td className="px-4 py-2 text-foreground-soft">{item.assignedInvestigator?.displayName ?? '—'}</td>
            <td className="px-4 py-2 text-muted-foreground">{formatRelative(item.updatedAt)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
