import { useCallback } from 'react';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState';
import { adminUsersFiltersSchema, type AdminUsersFilters } from '../schemas/adminUsers.schema';

/** Filters + page live in the URL — shareable, back-button-correct, refresh-stable
 * (same discipline as useAuditFilters.ts). */
export function useAdminUsersFilters(): readonly [AdminUsersFilters, (patch: Partial<AdminUsersFilters>) => void] {
  const [filters, update] = useSearchParamsState(adminUsersFiltersSchema);

  const setFilters = useCallback(
    (patch: Partial<AdminUsersFilters>) => {
      const patchesPageItself = 'page' in patch;
      update(patchesPageItself ? patch : { ...patch, page: 1 });
    },
    [update],
  );

  return [filters, setFilters] as const;
}
