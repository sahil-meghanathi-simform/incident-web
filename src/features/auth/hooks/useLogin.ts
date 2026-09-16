import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginRequest } from '../../../api/endpoints/auth.api';
import { setAccessToken } from '../../../api/client';
import { queryKeys } from '../../../api/queryKeys';
import type { LoginRequest } from '../schemas/auth.schema';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginRequest) => loginRequest(input),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(queryKeys.session, data.user);
    },
  });
}
