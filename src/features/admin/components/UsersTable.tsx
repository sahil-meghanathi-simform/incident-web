// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { RoleBadge } from './RoleBadge';
import { ClearanceBadge } from './ClearanceBadge';
import { formatDateTime, formatRelative } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import type { AdminUserRow } from '../../../api/contracts/admin.contract';

type UsersTableProps = Readonly<{
  items: readonly AdminUserRow[];
  onEdit: (user: AdminUserRow) => void;
  /** Pagination, rendered inside the table card. */
  footer?: ReactNode;
}>;

const COLUMNS = LABELS.admin.usersColumns;

export function UsersTable({ items, onEdit, footer }: UsersTableProps): ReactElement {
  return (
    <Table isStacked footer={footer}>
      <TableHeader>
        <th>{COLUMNS.user}</th>
        <th>{COLUMNS.role}</th>
        <th>{COLUMNS.clearance}</th>
        <th>{COLUMNS.status}</th>
        <th>{COLUMNS.createdAt}</th>
        <th>
          <span className="sr-only">{COLUMNS.actions}</span>
        </th>
      </TableHeader>
      <TableBody>
        {items.map((user) => (
          <TableRow key={user.id}>
            <TableCell label={COLUMNS.user} isWide>
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={user.displayName} className="h-9 w-9" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{user.displayName}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell label={COLUMNS.role}>
              <RoleBadge role={user.role} />
            </TableCell>
            <TableCell label={COLUMNS.clearance}>
              <ClearanceBadge level={user.clearanceLevel} />
            </TableCell>
            <TableCell label={COLUMNS.status}>
              <StatusBadge
                isActive={user.isActive}
                activeLabel={LABELS.admin.statusActive}
                inactiveLabel={LABELS.admin.statusInactive}
              />
            </TableCell>
            <TableCell label={COLUMNS.createdAt} className="whitespace-nowrap text-xs text-muted-foreground">
              <time dateTime={user.createdAt} title={formatDateTime(user.createdAt)}>
                {formatRelative(user.createdAt)}
              </time>
            </TableCell>
            <TableCell isWide className="md:text-right">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(user)}
                aria-label={LABELS.admin.editUserAria(user.displayName)}
                className="max-md:w-full"
              >
                <Pencil aria-hidden="true" />
                {LABELS.admin.editUser}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
