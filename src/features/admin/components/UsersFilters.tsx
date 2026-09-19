import type { ReactElement } from 'react';
import { Field } from '../../../components/ui/Field';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { RoleValues } from '../../../api/contracts/enums';
import { LABELS } from '../../../lib/labels';
import type { AdminUsersFilters } from '../schemas/adminUsers.schema';

type UsersFiltersProps = Readonly<{
  filters: AdminUsersFilters;
  onChange: (patch: Partial<AdminUsersFilters>) => void;
}>;

function isRole(value: string): value is (typeof RoleValues)[number] {
  return (RoleValues as readonly string[]).includes(value);
}

export function UsersFilters({ filters, onChange }: UsersFiltersProps): ReactElement {
  const hasAnyFilter = !!filters.role?.length || filters.isActive !== undefined || !!filters.q;

  return (
    <Card className="flex flex-wrap items-end justify-between gap-4 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <Field label={LABELS.admin.usersFilterRole} htmlFor="users-filter-role">
            <Select
              id="users-filter-role"
              value={filters.role?.[0] ?? ''}
              onChange={(e) => {
                const { value } = e.target;
                onChange({ role: value && isRole(value) ? [value] : undefined });
              }}
            >
              <option value="">{LABELS.admin.usersFilterRoleAny}</option>
              {RoleValues.map((role) => (
                <option key={role} value={role}>
                  {role.replaceAll('_', ' ')}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div>
          <Field label={LABELS.admin.usersFilterStatus} htmlFor="users-filter-status">
            <Select
              id="users-filter-status"
              value={filters.isActive === undefined ? '' : String(filters.isActive)}
              onChange={(e) => {
                const { value } = e.target;
                onChange({ isActive: value === '' ? undefined : value === 'true' });
              }}
            >
              <option value="">{LABELS.admin.usersFilterStatusAny}</option>
              <option value="true">{LABELS.admin.usersFilterStatusActive}</option>
              <option value="false">{LABELS.admin.usersFilterStatusInactive}</option>
            </Select>
          </Field>
        </div>

        <div className="min-w-56">
          <Field label={LABELS.admin.usersFilterSearch} htmlFor="users-filter-search">
            <Input
              id="users-filter-search"
              placeholder={LABELS.admin.usersFilterSearchPlaceholder}
              value={filters.q ?? ''}
              onChange={(e) => onChange({ q: e.target.value || undefined })}
            />
          </Field>
        </div>
      </div>

      {hasAnyFilter && (
        <Button type="button" variant="ghost" onClick={() => onChange({ role: undefined, isActive: undefined, q: undefined })}>
          Clear all
        </Button>
      )}
    </Card>
  );
}
