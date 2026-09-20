// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { LABELS } from '../../lib/labels';

type SkipLinkProps = Readonly<{ targetId: string }>;

/** First focusable element on every signed-in page: lets keyboard users jump past
 * the sidebar and top bar straight to the page content. Invisible until focused. */
export function SkipLink({ targetId }: SkipLinkProps): ReactElement {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[80]"
    >
      {LABELS.nav.skipToContent}
    </a>
  );
}
