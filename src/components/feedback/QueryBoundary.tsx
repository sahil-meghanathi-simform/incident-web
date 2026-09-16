import { Suspense, type ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorState } from '../ui/ErrorState';
import { ApiError } from '../../api/ApiError';

interface QueryBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Minimal Suspense + error reset wrapper. Full react-error-boundary integration can be
 * added per-feature; this is the shared shell every suspense-driven subtree uses.
 */
export function QueryBoundary({ children, fallback }: QueryBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {() => <Suspense fallback={fallback ?? <ErrorState message="Loading…" />}>{children}</Suspense>}
    </QueryErrorResetBoundary>
  );
}

export function isAccessRevoked(error: unknown): boolean {
  return error instanceof ApiError && error.code === 'INSUFFICIENT_CLEARANCE';
}
