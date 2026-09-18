import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { changeUserRole } from '../../../api/endpoints/admin.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { AdminUserMutationResponse } from '../../../api/contracts/admin.contract';
import type { Role } from '../../../api/contracts/enums';

type ChangeUserRoleInput = Readonly<{ userId: string; role: Role }>;

export function useChangeUserRole(): UseMutationResult<AdminUserMutationResponse, ApiError, ChangeUserRoleInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: ChangeUserRoleInput) => changeUserRole(userId, role),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.usersAll });
    },
  });
}
