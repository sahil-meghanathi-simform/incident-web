import { isApiError } from '../api/ApiError';
import { LABELS } from './labels';

/**
 * The one place a caught mutation/query error becomes user-facing copy (queries.md —
 * "every mutation's onError calls it, never re-derives a message inline"). Callers
 * still branch on status code first when a failure needs field-level handling (422 ->
 * setError, 409 -> a specific field message); this is the fallback for everything else.
 */
export function getErrorMessage(err: unknown): string {
  if (isApiError(err)) return err.message;
  return LABELS.errors.generic;
}
