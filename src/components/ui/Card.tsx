// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { HTMLAttributes, ReactElement } from 'react';
import { cn } from '../../lib/cn';

type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Replaces the `rounded-lg border border-slate-200 bg-white p-4` chrome that was
 * copy-pasted across ~15 feature components — tailwind.md: "when the same class
 * string appears a third time, extract a shared component."
 */
export function Card({ className, ...rest }: CardProps): ReactElement {
  return <div className={cn('rounded-lg border border-border bg-card text-card-foreground shadow-sm', className)} {...rest} />;
}

export function CardHeader({ className, ...rest }: CardProps): ReactElement {
  return <div className={cn('flex flex-col gap-1.5 p-4', className)} {...rest} />;
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>): ReactElement {
  return <h3 className={cn('font-display text-base font-semibold tracking-snug text-foreground', className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>): ReactElement {
  return <p className={cn('text-sm text-muted-foreground', className)} {...rest} />;
}

export function CardContent({ className, ...rest }: CardProps): ReactElement {
  return <div className={cn('p-4 pt-0', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: CardProps): ReactElement {
  return <div className={cn('flex items-center gap-2 p-4 pt-0', className)} {...rest} />;
}
