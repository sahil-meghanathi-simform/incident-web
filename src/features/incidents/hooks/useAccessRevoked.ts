import { isApiError } from '../../../api/ApiError';

/** True only for a genuine clearance refusal — never for a 404 or a network error. */
export function useAccessRevoked(error: unknown): boolean {
  return isApiError(error) && error.code === 'INSUFFICIENT_CLEARANCE';
}
