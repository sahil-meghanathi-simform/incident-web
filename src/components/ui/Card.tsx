// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { HTMLAttributes, ReactElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

export const cardVariants = cva('rounded-xl border bg-card text-card-foreground', {
  variants: {
    variant: {
      default: 'border-border shadow-sm',
      /** Hero surfaces — the auth card's treatment. */
      elevated: 'border-border/70 shadow-md',
      /** A whole card that is a link or button target. */
      interactive:
        'border-border shadow-sm transition-[box-shadow,border-color,transform] duration-200 ease-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-ring/30',
      muted: 'border-border bg-muted/60 shadow-none',
    },
  },
  defaultVariants: { variant: 'default' },
});

type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

/**
 * Replaces the `rounded-lg border border-slate-200 bg-white p-4` chrome that was
 * copy-pasted across ~15 feature components — tailwind.md: "when the same class
 * string appears a third time, extract a shared component."
 */
export function Card({ className, variant, ...rest }: CardProps): ReactElement {
  return <div className={cn(cardVariants({ variant }), className)} {...rest} />;
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn('flex flex-col gap-1 p-5 pb-3', className)} {...rest} />;
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>): ReactElement {
  return (
    <h3
      className={cn('flex items-center gap-2 font-display text-lg font-semibold tracking-snug text-foreground', className)}
      {...rest}
    />
  );
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>): ReactElement {
  return <p className={cn('text-sm text-muted-foreground', className)} {...rest} />;
}

export function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn('p-5 pt-0', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn('flex items-center gap-2 border-t border-border px-5 py-3', className)} {...rest} />;
}
