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
import type { IncidentListItem } from '../types/incident.type';

type IncidentTableProps = Readonly<{
  items: readonly IncidentListItem[];
}>;

export function IncidentTable({ items }: IncidentTableProps): ReactElement {
  return (
    <Table>
      <TableHeader>
        <th className="px-4 py-2">{LABELS.incidents.columns.reference}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.title}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.type}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.severity}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.stage}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.assignee}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.age}</th>
        <th className="px-4 py-2" />
      </TableHeader>
      <tbody className="divide-y divide-slate-100">
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-slate-50">
            <td className="px-4 py-2 font-mono text-xs text-slate-700">
              <Link to={ROUTES.incidentDetail(item.id)} className="text-blue-600 hover:underline">
                {item.reference}
              </Link>
            </td>
            <td className="max-w-xs truncate px-4 py-2 text-slate-900">{item.title}</td>
            <td className="px-4 py-2 text-slate-600">{item.type.replace('_', ' ')}</td>
            <td className="px-4 py-2">
              <SeverityBadge severity={item.severity} />
            </td>
            <td className="px-4 py-2">
              <StageBadge stage={item.stage} />
            </td>
            <td className="px-4 py-2 text-slate-600">{item.assignedInvestigator?.displayName ?? '—'}</td>
            <td className="px-4 py-2 text-slate-500">{formatRelative(item.createdAt)}</td>
            <td className="px-4 py-2">
              <EscalationBadge level={item.currentEscalationLevel} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
