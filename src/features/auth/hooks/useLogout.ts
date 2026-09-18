import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { logoutRequest } from '../../../api/endpoints/auth.api';
import { setAccessToken } from '../../../api/client';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';

export function useLogout(): UseMutationResult<void, ApiError, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: async () => {
      // The user asked to log out, so the local session ends regardless of whether the
      // request itself succeeded (e.g. a network failure).
      setAccessToken(null);
      // Force useSession's still-mounted observer through a real refetch cycle BEFORE
      // clearing the rest of the cache — see useLogin.ts's onSuccess and
      // docs/decisions.md for why this, not a bare cache write/removal, is the
      // reliable way to make an already-mounted observer's own React state catch up
      // (confirmed empirically: it can silently stop tracking the cache after a direct
      // write or a clear(), fixable only by an explicit refetch or a full reload).
      // getAccessToken() is already null, so this resolves to the correct anonymous
      // state, not a real /me call — invalidating (rather than clearing) first is what
      // gives the observer a Query object to actually refetch against.
      await queryClient.invalidateQueries({ queryKey: queryKeys.session });
      // THEN clear everything else — so the next user of this tab can't read any of
      // the previous user's cached incident data (security.md).
      queryClient.clear();
    },
  });
}
