// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// Deliberately NOT shadcn's TableHeader (which wraps only <thead>, leaving the
// caller to add TableRow/TableHead) — the table call sites pass <th> children
// directly, so this stays one styled thead+tr wrapper. When the parent Table is
// stacked (mobile card layout) the header row is kept for screen readers but
// visually hidden, since each cell carries its own label there.
//
// The cells are sticky, not the <thead>: the header stays pinned while Table's
// body scrolls under it. That needs an opaque background (rows would show through
// bg-muted/70) and an inset shadow for the bottom rule — under border-collapse a
// real border belongs to the table grid and scrolls away from a sticky cell. z-20
// keeps it above a body's own sticky cells (the analytics matrix's row headers).
import type { ReactElement, ReactNode } from 'react';

export function TableHeader({ children }: { children: ReactNode }): ReactElement {
  return (
    <thead className="group-data-[stacked=true]/table:max-md:sr-only">
      <tr className="text-left font-display text-xs font-semibold uppercase tracking-caps text-muted-foreground [&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:whitespace-nowrap [&>th]:bg-muted [&>th]:px-4 [&>th]:py-2.5 [&>th]:font-semibold [&>th]:shadow-[inset_0_-1px_0_var(--color-border)]">
        {children}
      </tr>
    </thead>
  );
}
