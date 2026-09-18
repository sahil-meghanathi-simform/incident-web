import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { Badge } from '../../../components/ui/Badge';
import { formatDateTime } from '../../../lib/datetime';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { AuditRow } from '../../../api/contracts/audit.contract';

type AuditTableProps = Readonly<{
  items: readonly AuditRow[];
}>;

/** The flat, unredacted admin view (§13.1) — this route is ADMIN-gated server-side, so
 * unlike the per-incident timeline there is no NOTE_ADDED redaction to render here. */
export function AuditTable({ items }: AuditTableProps): ReactElement {
  return (
    <Table>
      <TableHeader>
        <th className="px-4 py-2">{LABELS.admin.auditColumns.occurredAt}</th>
        <th className="px-4 py-2">{LABELS.admin.auditColumns.type}</th>
        <th className="px-4 py-2">{LABELS.admin.auditColumns.actor}</th>
        <th className="px-4 py-2">{LABELS.admin.auditColumns.incident}</th>
        <th className="px-4 py-2">{LABELS.admin.auditColumns.fromTo}</th>
        <th className="px-4 py-2">{LABELS.admin.auditColumns.reason}</th>
      </TableHeader>
      <tbody className="divide-y divide-slate-100">
        {items.map((row) => (
          <tr key={row.id} className="hover:bg-slate-50">
            <td className="whitespace-nowrap px-4 py-2 text-xs text-slate-500">{formatDateTime(row.occurredAt)}</td>
            <td className="px-4 py-2">
              <Badge className="border-slate-300 bg-slate-50 text-slate-700">{row.type.replaceAll('_', ' ')}</Badge>
            </td>
            <td className="px-4 py-2 text-slate-700">{row.actor?.displayName ?? '—'}</td>
            <td className="px-4 py-2 font-mono text-xs text-slate-700">
              {row.incidentId && row.incidentReference ? (
                <Link to={ROUTES.incidentDetail(row.incidentId)} className="text-blue-600 hover:underline">
                  {row.incidentReference}
                </Link>
              ) : (
                '—'
              )}
            </td>
            <td className="px-4 py-2 text-xs text-slate-600">
              {row.fromValue || row.toValue ? `${row.fromValue ?? '—'} → ${row.toValue ?? '—'}` : '—'}
            </td>
            <td className="max-w-xs truncate px-4 py-2 text-xs text-slate-500">{row.reason ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
