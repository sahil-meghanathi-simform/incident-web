// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { LABELS } from '../../../lib/labels';

/** The §1.8 disclosure: two viewers can legitimately see different totals for the same
 * period. Rendered once, in the page header's meta row — the full sentence, always
 * visible (never tooltip-only), but as a quiet line rather than a banner pushing the
 * numbers down the page. role="note": standing context, not a status change. */
export function ClearanceScopeNotice(): ReactElement | null {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <p role="note" className="flex max-w-3xl items-start gap-1.5">
      <ShieldCheck className="mt-px size-3.5 shrink-0 text-info" aria-hidden="true" />
      {LABELS.analytics.clearanceScopeNotice(user.clearanceLevel)}
    </p>
  );
}
