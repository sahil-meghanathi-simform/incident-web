// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

// `tone` has no default on purpose: SeverityBadge/StageBadge/EscalationBadge
// supply their full color set (bg/text/border) via `className` from
// lib/severity.ts / lib/stage.ts's own maps, and a default tone here would put
// a same-property color utility in both places — tailwind-merge only dedupes
// classes it recognizes as conflicting, and it doesn't know these are the same
// custom token family, so the two could both reach the stylesheet with the
// winner decided by generated CSS order rather than by this component's intent.
// Passing no `tone` skips the variant entirely, leaving color exclusively to
// the caller — `tone` is only for a plain badge with no domain coloring.
const badgeVariants = cva('inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium', {
  variants: {
    tone: {
      neutral: 'bg-muted text-foreground-soft border-border',
      outline: 'bg-transparent text-foreground border-border',
    },
  },
});

type BadgeProps = VariantProps<typeof badgeVariants> &
  Readonly<{
    className?: string;
    children: ReactNode;
  }>;

export function Badge({ tone, className, children }: BadgeProps): ReactElement {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>;
}
