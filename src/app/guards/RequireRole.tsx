import type { ReactElement, ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Forbidden } from '../../components/feedback/Forbidden';
import type { Role } from '../../api/contracts/enums';

type RequireRoleProps = Readonly<{
  roles: readonly Role[];
  children: ReactNode;
}>;

/** Coarse role gate. Renders Forbidden in place — never a redirect — so the URL stays intact. */
export function RequireRole({ roles, children }: RequireRoleProps): ReactElement {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Forbidden />;
  }

  return <>{children}</>;
}
