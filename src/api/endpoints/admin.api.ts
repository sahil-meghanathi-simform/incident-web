import { api } from '../client';
import {
  AdminJobRunsResponseSchema,
  type AdminJobRunsResponse,
  AdminUserMutationResponseSchema,
  type AdminUserMutationResponse,
  AdminUsersResponseSchema,
  type AdminUsersResponse,
  ClearanceImpactResponseSchema,
  type ClearanceImpactResponse,
  type TierSetRequest,
} from '../contracts/admin.contract';
import { EscalationTiersResponseSchema, type EscalationTiersResponse } from '../contracts/escalation.contract';
import type { Role } from '../contracts/enums';
import type { AdminUsersFilters } from '../../features/admin/schemas/adminUsers.schema';

export function listAdminUsers(filters: AdminUsersFilters): Promise<AdminUsersResponse> {
  return api.get<AdminUsersResponse>('/api/v1/admin/users', AdminUsersResponseSchema, {
    page: filters.page,
    pageSize: filters.pageSize,
    role: filters.role?.join(','),
    isActive: filters.isActive,
    q: filters.q,
  });
}

export function previewClearanceImpact(userId: string, clearanceLevel: number): Promise<ClearanceImpactResponse> {
  return api.get<ClearanceImpactResponse>(
    `/api/v1/admin/users/${userId}/clearance-impact`,
    ClearanceImpactResponseSchema,
    { clearanceLevel },
  );
}

export function changeUserRole(userId: string, role: Role): Promise<AdminUserMutationResponse> {
  return api.patch<AdminUserMutationResponse>(`/api/v1/admin/users/${userId}/role`, AdminUserMutationResponseSchema, {
    role,
  });
}

export function changeUserClearance(userId: string, clearanceLevel: number): Promise<AdminUserMutationResponse> {
  return api.patch<AdminUserMutationResponse>(
    `/api/v1/admin/users/${userId}/clearance`,
    AdminUserMutationResponseSchema,
    { clearanceLevel },
  );
}

export function toggleUserStatus(userId: string, isActive: boolean): Promise<AdminUserMutationResponse> {
  return api.patch<AdminUserMutationResponse>(
    `/api/v1/admin/users/${userId}/status`,
    AdminUserMutationResponseSchema,
    { isActive },
  );
}

export function getAdminTiers(): Promise<EscalationTiersResponse> {
  return api.get<EscalationTiersResponse>('/api/v1/admin/escalation-tiers', EscalationTiersResponseSchema);
}

export function putAdminTiers(body: TierSetRequest): Promise<EscalationTiersResponse> {
  return api.put<EscalationTiersResponse>('/api/v1/admin/escalation-tiers', EscalationTiersResponseSchema, body);
}

export function listAdminJobRuns(limit = 20): Promise<AdminJobRunsResponse> {
  return api.get<AdminJobRunsResponse>('/api/v1/admin/jobs/escalation/runs', AdminJobRunsResponseSchema, { limit });
}
