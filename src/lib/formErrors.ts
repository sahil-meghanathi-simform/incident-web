import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import type { ApiError } from '../api/ApiError';

/** Pipes ApiError.details (the 422 envelope) into RHF's setError — no translation layer. */
export function applyApiErrorToForm<T extends FieldValues>(error: ApiError, setError: UseFormSetError<T>): void {
  if (!error.details?.length) return;
  for (const detail of error.details) {
    setError(detail.path as Path<T>, { type: detail.code, message: detail.message });
  }
}
