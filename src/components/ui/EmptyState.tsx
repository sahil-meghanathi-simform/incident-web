// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { Inbox, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

type EmptyStateProps = Readonly<{
  title: string;
  body: string;
  action?: ReactNode;
  icon?: LucideIcon;
  size?: 'sm' | 'md';
}>;

/** Always {title, body, action?} — never a bare "No data". */
export function EmptyState({ title, body, action, icon: Icon = Inbox, size = 'md' }: EmptyStateProps): ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/60 text-center animate-in fade-in duration-300',
        size === 'md' ? 'px-6 py-14' : 'px-4 py-8',
      )}
    >
      <span
        className={cn(
          'mb-1 flex items-center justify-center rounded-full bg-accent text-accent-foreground ring-8 ring-accent/40',
          size === 'md' ? 'size-12' : 'size-9',
        )}
      >
        <Icon className={size === 'md' ? 'size-5' : 'size-4'} aria-hidden="true" />
      </span>
      <p className="font-display text-base font-semibold tracking-snug text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-3 flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  );
}
