import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../api/ApiError';

/**
 * Never retry 401/403/404/422 — those are outcomes, not transient failures, and
 * retrying them just delays the UI from showing the right state (login redirect,
 * AccessRevokedNotice, NotFound, field errors).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && [401, 403, 404, 422].includes(error.status)) return false;
        return failureCount < 2;
      },
    },
  },
});
