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
      <tbody className="divide-y divide-border">
        {items.map((user) => (
          <tr key={user.id} className="hover:bg-accent">
            <td className="px-4 py-2">
              <div className="font-medium text-foreground">{user.displayName}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </td>
            <td className="px-4 py-2 text-foreground-soft">{user.role.replaceAll('_', ' ')}</td>
            <td className="px-4 py-2 text-foreground-soft">{user.clearanceLevel}</td>
            <td className="px-4 py-2">
              <Badge
                className={
                  user.isActive
                    ? 'border-border bg-muted text-stage-closed'
                    : 'border-border bg-muted text-muted-foreground'
                }
              >
                {user.isActive ? LABELS.admin.statusActive : LABELS.admin.statusInactive}
              </Badge>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-xs text-muted-foreground">{formatDateTime(user.createdAt)}</td>
            <td className="px-4 py-2 text-right">
              <Button type="button" variant="outline" onClick={() => onEdit(user)}>
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
