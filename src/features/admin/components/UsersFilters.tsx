// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useCallback, type ReactElement } from 'react';
import { Search } from 'lucide-react';
import { Field } from '../../../components/ui/Field';
import { OptionSelect, type SelectOption } from '../../../components/ui/OptionSelect';
import { Card } from '../../../components/ui/Card';
import { FilterChips, type FilterChip } from '../../../components/ui/FilterChips';
import { FilterTextInput } from './FilterTextInput';
import { RoleValues, type Role } from '../../../api/contracts/enums';
import { LABELS } from '../../../lib/labels';
import type { AdminUsersFilters } from '../schemas/adminUsers.schema';

type UsersFiltersProps = Readonly<{
  filters: AdminUsersFilters;
  onChange: (patch: Partial<AdminUsersFilters>) => void;
}>;

const ROLE_OPTIONS: ReadonlyArray<SelectOption<Role>> = RoleValues.map((role) => ({
  value: role,
  label: LABELS.admin.roleLabelFor(role),
}));

const STATUS_OPTIONS: ReadonlyArray<SelectOption<'true' | 'false'>> = [
  { value: 'true', label: LABELS.admin.usersFilterStatusActive },
  { value: 'false', label: LABELS.admin.usersFilterStatusInactive },
];

function buildChips(filters: AdminUsersFilters, onChange: UsersFiltersProps['onChange']): FilterChip[] {
  const chips: FilterChip[] = [];
  for (const role of filters.role ?? []) {
    const label = LABELS.admin.usersChip.role(LABELS.admin.roleLabelFor(role));
    const remaining = (filters.role ?? []).filter((r) => r !== role);
    chips.push({
      id: `role-${role}`,
      label,
      removeLabel: LABELS.admin.removeFilter(label),
      onRemove: () => onChange({ role: remaining.length ? remaining : undefined }),
    });
  }
  if (filters.isActive !== undefined) {
    const label = LABELS.admin.usersChip.status(
      filters.isActive ? LABELS.admin.usersFilterStatusActive : LABELS.admin.usersFilterStatusInactive,
    );
    chips.push({ id: 'status', label, removeLabel: LABELS.admin.removeFilter(label), onRemove: () => onChange({ isActive: undefined }) });
  }
  if (filters.q) {
    const label = LABELS.admin.usersChip.search(filters.q);
    chips.push({ id: 'q', label, removeLabel: LABELS.admin.removeFilter(label), onRemove: () => onChange({ q: undefined }) });
  }
  return chips;
}

/** A compact toolbar: debounced search, role and status pickers, then the active
 * filters as removable chips. URL keys and patch shapes are unchanged. */
export function UsersFilters({ filters, onChange }: UsersFiltersProps): ReactElement {
  const commitSearch = useCallback((q: string | undefined) => onChange({ q }), [onChange]);

  return (
    <div className="mb-4 space-y-3">
      <Card className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <FilterTextInput
            id="users-filter-search"
            type="search"
            icon={Search}
            label={LABELS.admin.usersFilterSearch}
            placeholder={LABELS.admin.usersFilterSearchPlaceholder}
            value={filters.q}
            onCommit={commitSearch}
          />
        </div>

        <Field label={LABELS.admin.usersFilterRole} htmlFor="users-filter-role">
          <OptionSelect
            id="users-filter-role"
            options={ROLE_OPTIONS}
            anyLabel={LABELS.admin.usersFilterRoleAny}
            value={filters.role?.[0]}
            onChange={(role) => onChange({ role: role ? [role] : undefined })}
          />
        </Field>

        <Field label={LABELS.admin.usersFilterStatus} htmlFor="users-filter-status">
          <OptionSelect
            id="users-filter-status"
            options={STATUS_OPTIONS}
            anyLabel={LABELS.admin.usersFilterStatusAny}
            value={filters.isActive === undefined ? undefined : filters.isActive ? 'true' : 'false'}
            onChange={(status) => onChange({ isActive: status === undefined ? undefined : status === 'true' })}
          />
        </Field>
      </Card>

      <FilterChips
        chips={buildChips(filters, onChange)}
        clearAllLabel={LABELS.admin.usersClearFilters}
        onClearAll={() => onChange({ role: undefined, isActive: undefined, q: undefined })}
      />
    </div>
  );
}
