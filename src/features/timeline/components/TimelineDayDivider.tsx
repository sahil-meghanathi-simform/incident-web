// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';

type TimelineDayDividerProps = Readonly<{
  label: string;
}>;

/** A day heading on the rail — a small pill sitting over the connecting line. */
export function TimelineDayDivider({ label }: TimelineDayDividerProps): ReactElement {
  return (
    <li className="relative flex pt-2 first:pt-0">
      <span className="rounded-full border border-border bg-background px-3 py-1 font-display text-xs font-semibold uppercase tracking-caps text-muted-foreground shadow-xs">
        {label}
      </span>
    </li>
  );
}
