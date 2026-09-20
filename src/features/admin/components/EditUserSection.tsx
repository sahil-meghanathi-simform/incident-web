// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { AlertCircle, type LucideIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { LABELS } from '../../../lib/labels';

type EditUserSectionProps = Readonly<{
  icon: LucideIcon;
  title: string;
  /** A short line under the title — usually the saved value. */
  subtitle: string;
  isDirty?: boolean;
  error?: string | null;
  /** Why the action is unavailable, or what it will do. */
  hint?: string;
  action: ReactNode;
  children?: ReactNode;
}>;

/**
 * One independently-saved block of the drawer (role / clearance / status each hit
 * their own PATCH route). Deliberately a plain <section> with a heading and no
 * aria-labelledby: a labelled section would itself match the specs' label queries.
 */
export function EditUserSection({
  icon: Icon,
  title,
  subtitle,
  isDirty = false,
  error,
  hint,
  action,
  children,
}: EditUserSectionProps): ReactElement {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {isDirty && (
          <Badge tone="warning" dotClassName="bg-warning">
            {LABELS.admin.unsavedBadge}
          </Badge>
        )}
      </div>

      {children}

      {error && (
        <Alert variant="destructive" className="flex gap-2 animate-in fade-in duration-200 motion-reduce:animate-none">
          <AlertCircle aria-hidden="true" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">{hint}</p>
        <div className="shrink-0">{action}</div>
      </div>
    </section>
  );
}
