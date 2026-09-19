// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { HTMLAttributes, ReactElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

/**
 * Replaces ~6 ad-hoc banners that hand-rolled the same
 * `rounded-lg border px-6 py-4` chrome: ClearanceNotice, NotesConfidentialityBanner,
 * AccessRevokedNotice, NotesRestrictedNotice, and ErrorState's internal markup.
 */
const alertVariants = cva('rounded-lg border px-4 py-3 text-sm [&>svg]:h-4 [&>svg]:w-4', {
  variants: {
    variant: {
      default: 'bg-card border-border text-foreground',
      warning: 'bg-severity-medium-surface border-severity-medium-border text-severity-medium',
      destructive: 'bg-destructive/10 border-destructive/30 text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

type AlertProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>;

export function Alert({ className, variant, ...rest }: AlertProps): ReactElement {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...rest} />;
}

export function AlertTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>): ReactElement {
  return <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...rest} />;
}

export function AlertDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>): ReactElement {
  return <p className={cn('text-sm [&_p]:leading-relaxed', className)} {...rest} />;
}
