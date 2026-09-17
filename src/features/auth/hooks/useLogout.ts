import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { logoutRequest } from '../../../api/endpoints/auth.api';
import { setAccessToken } from '../../../api/client';
import type { ApiError } from '../../../api/ApiError';

export function useLogout(): UseMutationResult<void, ApiError, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: () => {
      // Clear client state even if the request itself failed (e.g. network) — the user
      // asked to log out, so the local session ends regardless. queryClient.clear()
      // (not a targeted setQueryData) so the next user of this tab can't read any of
      // the previous user's cached incident data (security.md).
      setAccessToken(null);
      queryClient.clear();
    },
  });
}
