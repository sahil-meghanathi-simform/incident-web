import type { ReactElement, ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

type RequireClearanceProps = Readonly<{
  minLevel: number;
  children: ReactNode;
  fallback?: ReactNode;
}>;

/**
 * Optimistic UI gate ONLY — the server remains the real gate (Q9/Q10). This hides an
 * affordance the request would be refused for anyway; it must never be the only thing
 * standing between a user and a severity they can't see.
 */
export function RequireClearance({ minLevel, children, fallback = null }: RequireClearanceProps): ReactElement {
  const { user } = useAuth();

  if (!user || user.clearanceLevel < minLevel) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
