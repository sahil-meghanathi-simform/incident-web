import type { ReactElement } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { LABELS } from '../../../lib/labels';

/** The §1.8 disclosure: two viewers can legitimately see different totals for the same
 * period. Rendered once at the top of the page, not per-section. */
export function ClearanceScopeNotice(): ReactElement | null {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div role="status" className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">
      {LABELS.analytics.clearanceScopeNotice(user.clearanceLevel)}
    </div>
  );
}
