import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';
import { getAccessToken, setAccessToken } from '../../../api/client';
import { refreshAccessToken } from '../../../api/refresh';
import { isApiError, type ApiError } from '../../../api/ApiError';
import { meRequest } from '../../../api/endpoints/auth.api';
import type { SessionUser } from '../../../types/auth.type';

/**
 * On a fresh page load the access token is gone (it's an in-memory variable — see
 * api/client.ts), but a valid httpOnly refresh cookie may still exist. apiRequest only
 * auto-refreshes on a TOKEN_EXPIRED 401 from an already-attempted call, so bootstrap has
 * to explicitly try the refresh cookie FIRST, before ever calling /me, or a user with a
 * perfectly good session would appear logged out on every reload.
 */
async function fetchSession(): Promise<SessionUser | null> {
  if (!getAccessToken()) {
    const token = await refreshAccessToken();
    if (!token) return null;
    setAccessToken(token);
  }

  try {
    return await meRequest();
  } catch (err) {
    if (isApiError(err) && err.status === 401) return null;
    throw err;
  }
}

/** staleTime: 0 + refetch-on-focus so a clearance/role change surfaces on the next tab focus. */
export function useSession(): UseQueryResult<SessionUser | null, ApiError> {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: fetchSession,
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: false,
  });
}
