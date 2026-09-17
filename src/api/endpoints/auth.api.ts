import { api } from '../client';
import {
  AuthResponseSchema,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
  UserSummarySchema,
  type UserSummary,
} from '../contracts/auth.contract';

export function registerRequest(body: RegisterRequest): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/v1/auth/register', AuthResponseSchema, body);
}

export function loginRequest(body: LoginRequest): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/v1/auth/login', AuthResponseSchema, body);
}

export function logoutRequest(): Promise<void> {
  return api.post<void>('/api/v1/auth/logout', null);
}

export function meRequest(): Promise<UserSummary> {
  return api.get<UserSummary>('/api/v1/auth/me', UserSummarySchema);
}
