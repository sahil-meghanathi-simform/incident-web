// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// Wraps its own TooltipPrimitive.Provider so a Tooltip works anywhere — including
// component specs that render without AppProviders. The app-wide provider in
// AppProviders.tsx still sets the shared delay; a nested provider with the same
// settings behaves identically.
import type { ReactElement, ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/cn';

type TooltipProps = Readonly<{
  label: string;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** When false the tooltip never opens (e.g. a collapsible nav that is expanded). */
  isEnabled?: boolean;
}>;

export function Tooltip({ label, children, side = 'top', isEnabled = true }: TooltipProps): ReactElement {
  if (!isEnabled) return <>{children}</>;
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-50 max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md',
              'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
            )}
          >
            {label}
            <TooltipPrimitive.Arrow className="fill-foreground" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
