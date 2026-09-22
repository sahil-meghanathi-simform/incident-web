// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthBrandMark } from './AuthBrandMark';
import { AuthShowcase } from './AuthShowcase';

/**
 * Shared shell for /login and /register. It is a layout route, so the showcase stays
 * mounted (slide index and timer survive) while only the form swaps. The form comes
 * first in the DOM — it holds the page's h1 and is where a keyboard user should land.
 *
 * Below `lg` the showcase is hidden outright rather than stacked under the form: on a
 * phone it is a second screenful of marketing between the user and the only thing they
 * came here to do. `hidden` (display:none) also takes it out of the accessibility tree,
 * so the carousel's slides and controls are not in the tab order there. The brand
 * lockup it carries moves above the form so the screen is still marked.
 */
export function AuthLayout(): ReactElement {
  return (
    // The outer element owns the scrollport, the way AppShell does — the document
    // itself never scrolls (src/styles/index.css). The grid inside is `min-h-full`,
    // not `h-full`: at a short viewport (a phone in landscape, the register form with
    // every field in error) it grows past the scrollport and scrolls, instead of
    // `items-center` centering overflow that then can't be reached above the fold.
    <div className="h-dvh overflow-y-auto bg-background">
      <div className="grid min-h-full grid-cols-1 lg:grid-cols-2">
        <main className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
          <AuthBrandMark className="mb-6 w-full max-w-md lg:hidden" />
          <Outlet />
        </main>
        {/* Sticky and exactly one viewport tall, so the register form — which is taller
            than a short laptop screen — scrolls past a panel that stays put, instead of
            dragging the panel's brand mark and carousel controls off the top with it. */}
        <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:self-start">
          <AuthShowcase />
        </aside>
      </div>
    </div>
  );
}
