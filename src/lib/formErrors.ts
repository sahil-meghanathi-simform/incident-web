import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import type { ApiError } from '../api/ApiError';

/** Dot-separated field-name characters only — rejects `__proto__`-style or otherwise
 * malformed paths before they ever reach RHF's internal path-set utility. */
const SAFE_FIELD_PATH = /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*$/;

/** Pipes ApiError.details (the 422 envelope) into RHF's setError — no translation layer. */
export function applyApiErrorToForm<T extends FieldValues>(error: ApiError, setError: UseFormSetError<T>): void {
  if (!error.details?.length) return;
  for (const detail of error.details) {
    if (!SAFE_FIELD_PATH.test(detail.path)) continue;
    // rules-ok: no static field-name list is available for a generic T here; the regex
    // above is the runtime validation this crosses the boundary with (typescript.md).
    setError(detail.path as Path<T>, { type: detail.code, message: detail.message });
  }
}
