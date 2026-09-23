// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { type ButtonHTMLAttributes, type ReactElement, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
    'transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-smooth',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:shadow-md',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-accent',
        outline: 'border border-input bg-card text-foreground shadow-xs hover:border-primary/60 hover:bg-accent',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        ghost: 'bg-transparent text-foreground hover:bg-accent',
        link: 'h-auto px-0 text-primary underline-offset-4 hover:underline active:scale-100',
      },
      size: {
        sm: 'h-8 px-3 text-xs [&_svg]:size-3.5',
        md: 'h-9 px-3.5 [&_svg]:size-4',
        lg: 'h-10 px-5 [&_svg]:size-4',
        icon: 'size-9 [&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

/** The variant/size names, for a wrapper that forwards a caller's choice through
 * to Button without restating the list. */
export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> &
  Readonly<{
    isLoading?: boolean;
    /** Render the single child element (e.g. a router Link) with button styling. */
    asChild?: boolean;
  }>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, isLoading, asChild, className, children, disabled, ...rest },
  ref,
): ReactElement {
  const classes = cn(buttonVariants({ variant, size }), className);

  // Slot merges onto exactly one child element, so the loading spinner can't be
  // prepended here — callers that need a busy state render a real <button>.
  if (asChild) {
    return (
      <Slot ref={ref} className={classes} {...rest}>
        {children}
      </Slot>
    );
  }

  return (
    <button ref={ref} className={classes} disabled={disabled || isLoading} aria-busy={isLoading} {...rest}>
      {isLoading && <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
      {children}
    </button>
  );
});
