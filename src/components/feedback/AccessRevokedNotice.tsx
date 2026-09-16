import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes';

/**
 * The Q10 experience: rendered in place of the incident detail body when a 403 arrives
 * mid-session (severity was raised above the viewer's clearance) — never a navigation
 * away, so the user understands what happened.
 */
export function AccessRevokedNotice() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
      <p className="text-sm font-medium text-amber-900">You no longer have access to this incident</p>
      <p className="mt-1 text-sm text-amber-700">
        Its severity was raised above your clearance level. This is expected — clearance is
        re-checked on every request.
      </p>
      <Link to={ROUTES.incidents} className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline">
        Back to incident list
      </Link>
    </div>
  );
}
