// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

// `tone` has no default on purpose: SeverityBadge/EscalationBadge supply their
// full color set (bg/text/border) via `className` from lib/severity.ts's own maps,
// and a default tone here would put a same-property color utility in both places
// — tailwind-merge only dedupes classes it recognizes as conflicting, and it
// doesn't know these are the same custom token family, so the two could both
// reach the stylesheet with the winner decided by generated CSS order rather than
// by this component's intent. Passing no `tone` skips the variant entirely,
// leaving color exclusively to the caller.
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: 'border-border bg-muted text-foreground-soft',
        outline: 'border-border bg-transparent text-foreground',
        success: 'border-success-border bg-success-surface text-success',
        warning: 'border-warning-border bg-warning-surface text-warning',
        info: 'border-info-border bg-info-surface text-info',
        danger: 'border-destructive/30 bg-destructive/10 text-destructive',
        primary: 'border-primary/30 bg-accent text-accent-foreground',
      },
    },
  },
);

type BadgeProps = VariantProps<typeof badgeVariants> &
  Readonly<{
    className?: string;
    /** Classes for a leading status dot (a `bg-*` utility); omit for no dot. */
    dotClassName?: string;
    children: ReactNode;
  }>;

export function Badge({ tone, className, dotClassName, children }: BadgeProps): ReactElement {
  return (
    <span className={cn(badgeVariants({ tone }), className)}>
      {dotClassName && <span className={cn('size-1.5 shrink-0 rounded-full', dotClassName)} aria-hidden="true" />}
      {children}
    </span>
  );
}
