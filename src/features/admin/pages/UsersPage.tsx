import { useState, type ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { TablePagination } from '../../../components/ui/TablePagination';
import { UsersFilters } from '../components/UsersFilters';
import { UsersTable } from '../components/UsersTable';
import { EditUserDrawer } from '../components/EditUserDrawer';
import { useAdminUsersFilters } from '../hooks/useAdminUsersFilters';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

export function UsersPage(): ReactElement {
  useDocumentTitle(LABELS.admin.usersPageTitle);
  const [filters, setFilters] = useAdminUsersFilters();
  const query = useAdminUsers(filters);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Derived from the LIVE query data, never frozen at the moment "Edit" was clicked —
  // a successful role/clearance/status save refetches this same list, and the drawer
  // must show that fresh row (e.g. the clearance it was JUST changed to), not a stale
  // snapshot. If the edited row falls out of the current filtered page (e.g. a role
  // change moves it out of an active role filter), the drawer simply closes.
  const editingUser = editingUserId ? query.data?.items.find((u) => u.id === editingUserId) ?? null : null;

  return (
    <PageContainer>
      <PageHeader title={LABELS.admin.usersPageTitle} description={LABELS.admin.usersPageDescription} />

      <UsersFilters filters={filters} onChange={setFilters} />

      <div className="mt-4">
        {query.isPending && <SkeletonTable />}
        {query.isError && <ErrorState message={LABELS.admin.loadUsersError} onRetry={() => query.refetch()} />}
        {query.data && query.data.items.length === 0 && (
          <EmptyState title={LABELS.admin.usersEmptyTitle} body={LABELS.admin.usersEmptyBody} />
        )}
        {query.data && query.data.items.length > 0 && (
          <div className={cn(query.isPlaceholderData && 'opacity-60 transition-opacity')}>
            <UsersTable items={query.data.items} onEdit={(user) => setEditingUserId(user.id)} />
            <TablePagination
              page={query.data.page}
              totalPages={query.data.totalPages}
              onPageChange={(page) => setFilters({ page })}
            />
          </div>
        )}
      </div>

      <EditUserDrawer user={editingUser} onClose={() => setEditingUserId(null)} />
    </PageContainer>
  );
}
