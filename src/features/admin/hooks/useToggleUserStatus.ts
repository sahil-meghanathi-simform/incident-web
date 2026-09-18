import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toggleUserStatus } from '../../../api/endpoints/admin.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { AdminUserMutationResponse } from '../../../api/contracts/admin.contract';

type ToggleUserStatusInput = Readonly<{ userId: string; isActive: boolean }>;

export function useToggleUserStatus(): UseMutationResult<AdminUserMutationResponse, ApiError, ToggleUserStatusInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: ToggleUserStatusInput) => toggleUserStatus(userId, isActive),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.usersAll });
    },
  });
}
