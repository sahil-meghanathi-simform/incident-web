import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutRequest } from '../../../api/endpoints/auth.api';
import { setAccessToken } from '../../../api/client';
import { queryKeys } from '../../../api/queryKeys';

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: () => {
      // Clear client state even if the request itself failed (e.g. network) — the user
      // asked to log out, so the local session ends regardless.
      setAccessToken(null);
      queryClient.setQueryData(queryKeys.session, null);
    },
  });
}
