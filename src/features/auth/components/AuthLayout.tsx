// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthShowcase } from './AuthShowcase';

/**
 * Shared shell for /login and /register. It is a layout route, so the showcase stays
 * mounted (slide index and timer survive) while only the form swaps. The form comes
 * first in the DOM — it holds the page's h1 and is where a keyboard user should land —
 * and the same order simply stacks below `lg`.
 */
export function AuthLayout(): ReactElement {
  return (
    // Owns its own scrollport, the way AppShell does — the document itself never
    // scrolls (src/styles/index.css), so a short viewport has to scroll here instead
    // or the form below the fold would be unreachable.
    <div className="grid h-dvh grid-cols-1 overflow-y-auto bg-background lg:grid-cols-2">
      <main className="flex items-center justify-center px-4 py-10 sm:px-6 lg:py-12">
        <Outlet />
      </main>
      <aside className="flex lg:min-h-screen">
        <AuthShowcase />
      </aside>
    </div>
  );
}
