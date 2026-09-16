import type { UserSummary } from '../api/contracts/auth.contract';
import { ROUTES } from '../app/routes';

export type SessionUser = UserSummary;
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

/** Where a freshly-logged-in user lands absent a `?next=` target. */
const ROLE_HOME: Record<SessionUser['role'], string> = {
  REPORTER: ROUTES.incidentNew,
  TRIAGE_MANAGER: ROUTES.triageQueue,
  INVESTIGATOR: ROUTES.investigations,
  ADMIN: ROUTES.analytics,
};

export function roleHomeFor(role: SessionUser['role']): string {
  return ROLE_HOME[role];
}
