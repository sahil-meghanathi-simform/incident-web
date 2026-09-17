import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '../../../components/ui/Table';
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
}>;

/**
 * One row per actively-escalated incident (escalation.repository.ts's own semantics —
 * not one row per historical EscalationEvent), already sorted level desc, most-overdue
 * first by the API. Acknowledge reuses the exact same mutation/toast as the incident
 * detail page (`features/triage/components/AcknowledgeButton`) rather than a second
 * copy — acknowledging removes the row from this feed (useAcknowledgeIncident
 * invalidates queryKeys.escalations.feed).
 */
export function EscalationFeedTable({ items }: EscalationFeedTableProps): ReactElement {
  return (
    <Table>
      <TableHeader>
        <th className="px-4 py-2">{LABELS.incidents.columns.reference}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.title}</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.severity}</th>
        <th className="px-4 py-2">Level</th>
        <th className="px-4 py-2">{LABELS.incidents.columns.assignee}</th>
        <th className="px-4 py-2">SLA</th>
        <th className="px-4 py-2" />
      </TableHeader>
      <tbody className="divide-y divide-slate-100">
        {items.map((item) => (
          <tr key={item.incidentId} className="hover:bg-slate-50">
            <td className="px-4 py-2 font-mono text-xs text-slate-700">
              <Link to={ROUTES.incidentDetail(item.incidentId)} className="text-blue-600 hover:underline">
                {item.incidentReference}
              </Link>
            </td>
            <td className="max-w-xs truncate px-4 py-2 text-slate-900">{item.incidentTitle}</td>
            <td className="px-4 py-2">
              <SeverityBadge severity={item.severity} />
            </td>
            <td className="px-4 py-2">
              <EscalationBadge level={item.level} />
            </td>
            <td className="px-4 py-2 text-slate-600">{item.assignedInvestigator?.displayName ?? '—'}</td>
            <td className="px-4 py-2">
              <SlaCountdown dueAt={item.dueAt} />
            </td>
            <td className="px-4 py-2">
              <AcknowledgeButton incidentId={item.incidentId} version={item.version} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
