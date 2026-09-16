import { api } from '../client';
import type { AuthResponse, LoginRequest, RegisterRequest, UserSummary } from '../contracts/auth.contract';

export function registerRequest(body: RegisterRequest): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/v1/auth/register', body);
}

export function loginRequest(body: LoginRequest): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/v1/auth/login', body);
}

export function logoutRequest(): Promise<void> {
  return api.post<void>('/api/v1/auth/logout');
}

export function meRequest(): Promise<UserSummary> {
  return api.get<UserSummary>('/api/v1/auth/me');
}
