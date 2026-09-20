// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type PageHeaderProps = Readonly<{
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  icon?: LucideIcon;
  /** A small line of status under the description (counts, "updated 2m ago"). */
  meta?: ReactNode;
}>;

export function PageHeader({ title, description, actions, breadcrumb, icon: Icon, meta }: PageHeaderProps): ReactElement {
  return (
    <header className="mb-6 animate-in fade-in slide-in-from-bottom-1 duration-300 sm:mb-8">
      {breadcrumb && <div className="mb-3">{breadcrumb}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          {Icon && (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground ring-1 ring-primary/10">
              <Icon className="size-5" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-semibold tracking-display text-foreground">{title}</h1>
            {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
            {meta && <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">{meta}</div>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
