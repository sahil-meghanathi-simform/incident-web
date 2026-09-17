import type { ReactElement, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SplashLoader } from '../../components/feedback/SplashLoader';
import { ROUTES } from '../routes';

type RequireAuthProps = Readonly<{
  children: ReactNode;
}>;

export function RequireAuth({ children }: RequireAuthProps): ReactElement {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <SplashLoader />;

  if (status === 'anonymous') {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.login}?next=${next}`} replace />;
  }

  return <>{children}</>;
}
