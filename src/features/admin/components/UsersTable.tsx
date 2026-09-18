import type { ReactElement } from 'react';
import { Table } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatDateTime } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import type { AdminUserRow } from '../../../api/contracts/admin.contract';

type UsersTableProps = Readonly<{
  items: readonly AdminUserRow[];
  onEdit: (user: AdminUserRow) => void;
}>;

export function UsersTable({ items, onEdit }: UsersTableProps): ReactElement {
  return (
    <Table>
      <TableHeader>
        <th className="px-4 py-2">{LABELS.admin.usersColumns.user}</th>
        <th className="px-4 py-2">{LABELS.admin.usersColumns.role}</th>
        <th className="px-4 py-2">{LABELS.admin.usersColumns.clearance}</th>
        <th className="px-4 py-2">{LABELS.admin.usersColumns.status}</th>
        <th className="px-4 py-2">{LABELS.admin.usersColumns.createdAt}</th>
        <th className="px-4 py-2" />
      </TableHeader>
      <tbody className="divide-y divide-slate-100">
        {items.map((user) => (
          <tr key={user.id} className="hover:bg-slate-50">
            <td className="px-4 py-2">
              <div className="font-medium text-slate-900">{user.displayName}</div>
              <div className="text-xs text-slate-500">{user.email}</div>
            </td>
            <td className="px-4 py-2 text-slate-700">{user.role.replaceAll('_', ' ')}</td>
            <td className="px-4 py-2 text-slate-700">{user.clearanceLevel}</td>
            <td className="px-4 py-2">
              <Badge
                className={
                  user.isActive
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-slate-300 bg-slate-50 text-slate-500'
                }
              >
                {user.isActive ? LABELS.admin.statusActive : LABELS.admin.statusInactive}
              </Badge>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-xs text-slate-500">{formatDateTime(user.createdAt)}</td>
            <td className="px-4 py-2 text-right">
              <Button type="button" variant="secondary" onClick={() => onEdit(user)}>
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
