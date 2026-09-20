// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { CircleCheck } from 'lucide-react';
import { LABELS } from '../../../lib/labels';

/** The receipt's celebratory band — the login page's plum gradient and glass tile. */
export function ReceiptHero(): ReactElement {
  const copy = LABELS.incidents.receipt;
  return (
    <div className="relative isolate overflow-hidden bg-brand-deep bg-linear-to-br from-foreground via-brand-deep to-primary px-6 py-8 text-center text-primary-foreground sm:py-10">
      <div
        className="pointer-events-none absolute -right-16 -top-20 -z-10 size-56 rounded-full bg-primary-foreground/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 -z-10 size-64 rounded-full bg-primary/40 blur-3xl"
        aria-hidden="true"
      />
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/15 ring-1 ring-primary-foreground/20 animate-in zoom-in-50 fade-in duration-500 ease-smooth">
        <CircleCheck className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-4 text-xs font-semibold uppercase tracking-caps text-primary-foreground/80">
        {LABELS.incidents.incidentReported}
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold tracking-display">{copy.title}</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-primary-foreground/80">{copy.body}</p>
    </div>
  );
}
