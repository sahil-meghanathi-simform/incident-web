// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type FormSectionProps = Readonly<{
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}>;

/** One titled band of the report form card — icon tile, heading, one-line purpose. */
export function FormSection({ icon: Icon, title, description, children }: FormSectionProps): ReactElement {
  return (
    <section className="space-y-4 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground ring-1 ring-primary/10">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-base font-semibold tracking-snug text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
