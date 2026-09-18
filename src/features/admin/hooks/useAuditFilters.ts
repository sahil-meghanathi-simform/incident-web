import { useCallback } from 'react';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState';
import { auditSearchSchema, type AuditSearchFilters } from '../schemas/auditSearch.schema';

/** Filters + page live in the URL — shareable, back-button-correct, refresh-stable
 * (same discipline as useIncidentFilters.ts). */
export function useAuditFilters(): readonly [AuditSearchFilters, (patch: Partial<AuditSearchFilters>) => void] {
  const [filters, update] = useSearchParamsState(auditSearchSchema);

  const setFilters = useCallback(
    (patch: Partial<AuditSearchFilters>) => {
      const patchesPageItself = 'page' in patch;
      update(patchesPageItself ? patch : { ...patch, page: 1 });
    },
    [update],
  );

  return [filters, setFilters] as const;
}
