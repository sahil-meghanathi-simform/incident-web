// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useDelayedFlag } from '../../hooks/useDelayedFlag';
import { LABELS } from '../../lib/labels';

/**
 * A thin bar under the top of the window whenever any query is (re)fetching or any
 * mutation is in flight — so paging, filtering, background refreshes and saves are
 * never silent. Debounced so quick polls don't flash it. Not a live region: screen
 * readers get the per-region busy states instead of a stream of announcements.
 */
export function TopLoadingBar(): ReactElement | null {
  const isBusy = useIsFetching() + useIsMutating() > 0;
  const isShown = useDelayedFlag(isBusy);
  if (!isShown) return null;

  return (
    // rules-ok: z-[70] sits above toasts (z-[60]) and dialogs (z-50) — a thin bar
    // that must stay visible over any overlay; not worth a z-index token scale.
    <div
      role="progressbar"
      aria-label={LABELS.palette.loadingBar}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 overflow-hidden bg-primary/15 animate-in fade-in duration-200"
    >
      <div className="h-full w-full origin-left animate-loading-bar bg-linear-to-r from-primary via-brand-deep to-primary motion-reduce:animate-none motion-reduce:opacity-70" />
    </div>
  );
}
