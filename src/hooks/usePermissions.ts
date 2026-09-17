import { useAuth } from './useAuth';
import { SEVERITY_RANK, type Severity } from '../lib/severity';

export type UsePermissionsReturn = Readonly<{
  canTriage: boolean;
  canInvestigate: boolean;
  canAdminister: boolean;
  canSeeSeverity: (severity: Severity) => boolean;
}>;

/**
 * Derives UI affordances only — a hidden button or nav item is a convenience, never the
 * authorization boundary. The server re-checks role/clearance on every request
 * regardless of what this hook reports (Q8b/Q10).
 */
export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();

  return {
    canTriage: user?.role === 'TRIAGE_MANAGER' || user?.role === 'ADMIN',
    canInvestigate: user?.role === 'INVESTIGATOR' || user?.role === 'ADMIN',
    canAdminister: user?.role === 'ADMIN',
    canSeeSeverity: (severity: Severity): boolean =>
      user !== null && user !== undefined && SEVERITY_RANK[severity] <= user.clearanceLevel,
  };
}
