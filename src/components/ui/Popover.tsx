// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// React 18 forwardRef discipline — see Dialog.tsx's header comment.
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../../lib/cn';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent({ className, align = 'end', sideOffset = 8, ...rest }, ref) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // Capped to the viewport so a popover anchored near a phone's edge never
          // runs off-screen; callers override the width via className.
          'z-50 w-80 max-w-[calc(100vw-1.5rem)] rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className,
        )}
        {...rest}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
