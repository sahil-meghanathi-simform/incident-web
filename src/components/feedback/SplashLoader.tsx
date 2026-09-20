// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ShieldAlert } from 'lucide-react';
import { LABELS } from '../../lib/labels';

/** Full-page loading state while session bootstrap (GET /auth/me) resolves on first
 * paint — on the app's own background, so there's no white flash before the shell. */
export function SplashLoader(): ReactElement {
  return (
    <div role="status" className="flex min-h-dvh w-full flex-col items-center justify-center gap-5 bg-background">
      <span className="relative flex size-14 items-center justify-center rounded-2xl bg-brand-deep bg-linear-to-br from-foreground via-brand-deep to-primary text-primary-foreground shadow-lg">
        <ShieldAlert className="size-7" aria-hidden="true" />
        <span
          className="absolute inset-0 rounded-2xl ring-2 ring-primary/40 animate-ping motion-reduce:animate-none"
          aria-hidden="true"
        />
      </span>
      <span className="h-1 w-32 overflow-hidden rounded-full bg-primary/15" aria-hidden="true">
        <span className="block h-full w-full origin-left animate-loading-bar rounded-full bg-primary motion-reduce:animate-none" />
      </span>
      <span className="sr-only">{LABELS.chrome.loading}</span>
    </div>
  );
}
