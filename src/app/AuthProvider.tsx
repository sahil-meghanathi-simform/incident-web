import { createContext, useEffect, type ReactElement, type ReactNode } from 'react';
import { registerAuthLostHandler, setAccessToken } from '../api/client';
import { useSession } from '../features/auth/hooks/useSession';
import { ROUTES } from './routes';
import type { AuthStatus, SessionUser } from '../types/auth.type';

export type AuthContextValue = Readonly<{
  user: SessionUser | null;
  status: AuthStatus;
  refetch: () => void;
}>;

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Holds { user, status }, backed by useSession (staleTime: 0, refetch-on-focus, so a
 * clearance/role change surfaces fast — Q8b/Q10 on the frontend side). Registers the
 * client's onAuthLost handler once: a failed refresh means the session is unrecoverable,
 * so this does a hard `window.location` redirect rather than a router `navigate` — this
 * component renders OUTSIDE the router (AppProviders wraps RouterProvider in main.tsx),
 * so router hooks aren't available here.
 */
export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const { data, isLoading, refetch } = useSession();

  useEffect(() => {
    registerAuthLostHandler(() => {
      setAccessToken(null);
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.assign(`${ROUTES.login}?next=${next}`);
    });
  }, []);

  const status: AuthStatus = isLoading ? 'loading' : data ? 'authenticated' : 'anonymous';

  return (
    <AuthContext.Provider value={{ user: data ?? null, status, refetch }}>{children}</AuthContext.Provider>
  );
}
