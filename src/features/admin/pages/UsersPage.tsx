// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { FilterX, UserSearch, Users } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';
import { PagedQuerySection } from '../../../components/ui/PagedQuerySection';
import { UsersFilters } from '../components/UsersFilters';
import { UsersTable } from '../components/UsersTable';
import { EditUserDrawer } from '../components/EditUserDrawer';
import { useAdminUsersFilters } from '../hooks/useAdminUsersFilters';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
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
  const hasAnyFilter = !!filters.role?.length || filters.isActive !== undefined || !!filters.q;

  return (
    <PageContainer>
      <PageHeader
        icon={Users}
        title={LABELS.admin.usersPageTitle}
        description={LABELS.admin.usersPageDescription}
        meta={query.data ? <span>{LABELS.admin.usersTotal(query.data.totalItems)}</span> : undefined}
      />

      <UsersFilters filters={filters} onChange={setFilters} />

      <PagedQuerySection
        query={query}
        errorMessage={LABELS.admin.loadUsersError}
        onPageChange={(page) => setFilters({ page })}
        skeletonColumns={6}
        empty={
          <EmptyState
            icon={UserSearch}
            title={LABELS.admin.usersEmptyTitle}
            body={LABELS.admin.usersEmptyBody}
            action={
              hasAnyFilter ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ role: undefined, isActive: undefined, q: undefined })}
                >
                  <FilterX aria-hidden="true" />
                  {LABELS.admin.clearFilters}
                </Button>
              ) : undefined
            }
          />
        }
      >
        {(items, footer) => (
          <UsersTable items={items} footer={footer} onEdit={(user) => setEditingUserId(user.id)} />
        )}
      </PagedQuerySection>

      <EditUserDrawer user={editingUser} onClose={() => setEditingUserId(null)} />
    </PageContainer>
  );
}
