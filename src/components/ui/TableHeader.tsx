// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// Deliberately NOT shadcn's TableHeader (which wraps only <thead>, leaving the
// caller to add TableRow/TableHead) — this project's 11 table call sites all
// pass <th> children directly, and converting each to shadcn's fuller
// Table/TableBody/TableRow/TableHead/TableCell set means restructuring every
// <tbody>/<tr>/<td> in all 11 files for a naming-purity win with no visual
// difference. Kept as one styled thead+tr wrapper; only the tokens change.
import type { ReactElement, ReactNode } from 'react';

export function TableHeader({ children }: { children: ReactNode }): ReactElement {
  return (
    <thead className="bg-muted">
      <tr className="text-left font-display text-xs font-semibold uppercase tracking-caps text-muted-foreground">
        {children}
      </tr>
    </thead>
  );
}
