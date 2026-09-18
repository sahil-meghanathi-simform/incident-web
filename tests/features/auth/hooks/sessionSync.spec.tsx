import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useLogin } from '../../../../src/features/auth/hooks/useLogin';
import { useLogout } from '../../../../src/features/auth/hooks/useLogout';
import { useSession } from '../../../../src/features/auth/hooks/useSession';
import { setAccessToken } from '../../../../src/api/client';

const OLD_USER = { id: 'old-user', email: 'old@incident.local', displayName: 'Old User', role: 'REPORTER' as const, clearanceLevel: 1 };
const NEW_USER = { id: 'new-user', email: 'new@incident.local', displayName: 'New User', role: 'ADMIN' as const, clearanceLevel: 4 };

let currentUser: typeof OLD_USER | typeof NEW_USER | null = OLD_USER;

const logoutRequest = vi.fn().mockImplementation(async () => {
  currentUser = null;
});
const loginRequest = vi.fn().mockImplementation(async () => {
  currentUser = NEW_USER;
  return { accessToken: 'new-token', user: NEW_USER };
});
const meRequest = vi.fn().mockImplementation(async () => {
  if (!currentUser) throw Object.assign(new Error('401'), { status: 401 });
  return currentUser;
});

vi.mock('../../../../src/api/endpoints/auth.api', () => ({
  logoutRequest: (...args: unknown[]) => logoutRequest(...args),
  loginRequest: (...args: unknown[]) => loginRequest(...args),
  meRequest: (...args: unknown[]) => meRequest(...args),
}));

vi.mock('../../../../src/api/ApiError', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../src/api/ApiError')>();
  return actual;
});

function wrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

/**
 * Module 11 hardening regression: the reference-plan-era `useLogin`/`useLogout`
 * wrote the new session directly via `queryClient.setQueryData` — which updates the
 * cache (confirmed via `getQueryData`) but was found, via real Chrome automation, to
 * NOT reliably reach an already-mounted `useSession()` observer's own React state
 * (fixable only by a hard reload). This test mounts a REAL `useSession()` observer
 * alongside `useLogin`/`useLogout`, exactly like `AuthProvider` + `TopBar` in the real
 * app, so it exercises the actual observer/notification path a synthetic
 * `queryClient.setQueryData` probe does not. See docs/decisions.md.
 */
describe('useSession stays in sync across a fast logout → different-user login', () => {
  afterEach(() => {
    currentUser = OLD_USER;
    vi.clearAllMocks();
  });

  it('reflects the new user after logout+login with no gap for a stale render', async () => {
    const queryClient = new QueryClient();
    setAccessToken('old-token');

    const session = renderHook(() => useSession(), { wrapper: wrapper(queryClient) });
    await waitFor(() => expect(session.result.current.data).toEqual(OLD_USER));

    const logout = renderHook(() => useLogout(), { wrapper: wrapper(queryClient) });
    await act(async () => {
      logout.result.current.mutate();
    });
    await waitFor(() => expect(logout.result.current.isSuccess).toBe(true));

    const login = renderHook(() => useLogin(), { wrapper: wrapper(queryClient) });
    await act(async () => {
      login.result.current.form.setValue('email', 'new@incident.local');
      login.result.current.form.setValue('password', 'Password123!');
    });
    await act(async () => {
      login.result.current.onSubmit();
    });
    await waitFor(() => expect(loginRequest).toHaveBeenCalled());

    // The regression: without the fix, this can remain OLD_USER (or undefined)
    // indefinitely — nothing ever triggers another render of `session`.
    await waitFor(() => expect(session.result.current.data).toEqual(NEW_USER));
  });
});
