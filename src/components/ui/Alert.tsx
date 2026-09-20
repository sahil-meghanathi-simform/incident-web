// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { HTMLAttributes, ReactElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

/**
 * Replaces ~6 ad-hoc banners that hand-rolled the same
 * `rounded-lg border px-6 py-4` chrome: ClearanceNotice, NotesConfidentialityBanner,
 * AccessRevokedNotice, NotesRestrictedNotice, and ErrorState's internal markup.
 * A leading lucide icon child is sized and tinted automatically.
 */
const alertVariants = cva(
  'relative rounded-lg border px-4 py-3 text-sm [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-foreground [&>svg]:text-muted-foreground',
        info: 'border-info-border bg-info-surface text-info',
        success: 'border-success-border bg-success-surface text-success',
        warning: 'border-warning-border bg-warning-surface text-warning',
        destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

type AlertProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>;

export function Alert({ className, variant, ...rest }: AlertProps): ReactElement {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...rest} />;
}

export function AlertTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>): ReactElement {
  return <h5 className={cn('mb-1 font-semibold leading-snug', className)} {...rest} />;
}

export function AlertDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>): ReactElement {
  return <p className={cn('text-sm leading-relaxed [&_p]:leading-relaxed', className)} {...rest} />;
}
