import type { ReactElement } from 'react';
import { Loader2 } from 'lucide-react';

/** Full-page loading state while session bootstrap (GET /auth/me) resolves on first paint. */
export function SplashLoader(): ReactElement {
  return (
    <div role="status" className="flex h-screen w-screen items-center justify-center bg-white">
      <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
