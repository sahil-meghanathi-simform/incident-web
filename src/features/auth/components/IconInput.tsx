// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { forwardRef, type InputHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { cn } from '../../../lib/cn';

type IconInputProps = InputHTMLAttributes<HTMLInputElement> &
  Readonly<{
    icon: LucideIcon;
    /** Rendered over the input's right edge (e.g. the password visibility toggle). */
    trailing?: ReactNode;
    hasError?: boolean;
  }>;

/**
 * `Input` with a decorative leading icon. It is its own forwardRef component, not a
 * wrapper div at the call site, because `Field` clones its direct child to inject
 * `aria-describedby` — everything it receives is forwarded to the real input, so the
 * description still lands on the control a screen reader announces.
 */
export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(function IconInput(
  { icon: Icon, trailing, className, ...rest },
  ref,
): ReactElement {
  return (
    <div className="group relative">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint transition-colors group-focus-within:text-primary"
        aria-hidden="true"
      />
      <Input
        ref={ref}
        className={cn(
          // `text-base` below `sm`, not the app's usual `text-sm`: iOS Safari zooms the
          // whole page in when a focused control's font is under 16px, and it does not
          // zoom back out on blur. `h-11` gives the same fields a 44px touch target on a
          // phone; both step back down to the app's dense desktop sizing at `sm`.
          'h-11 pl-9 text-base transition-shadow read-only:cursor-progress sm:h-10 sm:text-sm',
          trailing ? 'pr-11' : undefined,
          className,
        )}
        {...rest}
      />
      {trailing}
    </div>
  );
});
