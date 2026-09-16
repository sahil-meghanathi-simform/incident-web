import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { ErrorState } from '../ui/ErrorState';
import { ROUTES } from '../../app/routes';

/** Per-route errorElement — catches contract/parse failures and thrown loader errors. */
export function RouteErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'An unexpected error occurred.';

  return (
    <div className="p-6">
      <ErrorState message={message} onRetry={() => window.location.reload()} />
      <p className="mt-3 text-center text-sm">
        <Link to={ROUTES.home} className="text-blue-600 hover:underline">
          Return home
        </Link>
      </p>
    </div>
  );
}
