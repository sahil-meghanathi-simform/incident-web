// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

type StatusPageProps = Readonly<{
  icon: LucideIcon;
  /** Small uppercase code above the title, e.g. "404". */
  eyebrow?: string;
  title: string;
  body: string;
  actions?: ReactNode;
  children?: ReactNode;
  tone?: 'neutral' | 'danger';
  /** Fill the viewport (outside the app shell) instead of the content area. */
  isFullScreen?: boolean;
}>;

/** The shared layout for whole-page states: not found, forbidden, crashed routes. */
export function StatusPage({
  icon: Icon,
  eyebrow,
  title,
  body,
  actions,
  children,
  tone = 'neutral',
  isFullScreen = false,
}: StatusPageProps): ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center animate-in fade-in slide-in-from-bottom-2 duration-500 ease-smooth',
        isFullScreen ? 'min-h-dvh bg-background' : 'min-h-[60dvh]',
      )}
    >
      <span
        className={cn(
          'mb-5 flex size-16 items-center justify-center rounded-2xl ring-8',
          tone === 'danger'
            ? 'bg-destructive/10 text-destructive ring-destructive/5'
            : 'bg-accent text-accent-foreground ring-accent/50',
        )}
      >
        <Icon className="size-7" aria-hidden="true" />
      </span>
      {eyebrow && (
        <p className="mb-2 font-display text-sm font-semibold uppercase tracking-caps text-muted-foreground">{eyebrow}</p>
      )}
      <h1 className="font-display text-3xl font-semibold tracking-display text-foreground">{title}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
      {actions && <div className="mt-7 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
      {children}
    </div>
  );
}
