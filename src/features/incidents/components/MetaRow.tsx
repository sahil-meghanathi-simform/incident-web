// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type MetaRowProps = Readonly<{
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}>;

/** One `<dt>`/`<dd>` pair in the incident's details list, with a leading icon. */
export function MetaRow({ icon: Icon, label, children }: MetaRowProps): ReactElement {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 break-words text-sm text-foreground">{children}</dd>
      </div>
    </div>
  );
}
