// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';

type LinkTileProps = Readonly<{
  to: string;
  label: string;
  icon: LucideIcon;
}>;

/** One icon tile in the dashboard's quick-links / admin grids. */
export function LinkTile({ to, label, icon: Icon }: LinkTileProps): ReactElement {
  return (
    <Link
      to={to}
      className="group flex h-full min-h-24 flex-col justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-sm font-medium text-foreground shadow-xs transition-[box-shadow,border-color,transform] duration-200 ease-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span className="flex items-start justify-between gap-2">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-accent text-accent-foreground ring-1 ring-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <ArrowUpRight
          className="size-4 text-foreground-faint transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary motion-reduce:transition-none"
          aria-hidden="true"
        />
      </span>
      <span className="leading-snug">{label}</span>
    </Link>
  );
}
