import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes';

/**
 * Rendered in place (never a redirect) so the URL that triggered it stays visible and
 * shareable with support — used both as the standalone `/403` route and inline by
 * RequireRole when a signed-in user's role doesn't permit the current route.
 */
export function Forbidden() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
      <h1 className="text-lg font-semibold text-slate-900">You don&apos;t have access to this page</h1>
      <p className="max-w-sm text-sm text-slate-500">
        Your role doesn&apos;t permit this action. If you think this is a mistake, contact an administrator.
      </p>
      <Link to={ROUTES.home} className="text-sm font-medium text-blue-600 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
