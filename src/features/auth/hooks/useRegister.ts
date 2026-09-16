import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerRequest } from '../../../api/endpoints/auth.api';
import { setAccessToken } from '../../../api/client';
import { queryKeys } from '../../../api/queryKeys';
import type { RegisterRequest } from '../schemas/auth.schema';

/** Register auto-logs-in (the backend returns the same shape as /login) — one flow. */
export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterRequest) => registerRequest(input),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(queryKeys.session, data.user);
    },
  });
}
