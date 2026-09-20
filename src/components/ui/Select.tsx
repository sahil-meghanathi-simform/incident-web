// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// shadcn/ui's Select (@radix-ui/react-select) — the app's one select, replacing the
// restyled native <select> this file used to hold. These are the styled parts; call
// sites use OptionSelect.tsx, which assembles them from an options array. The trigger
// takes the shared control classes from Input.tsx, so it matches every other field's
// edge, focus ring, error and disabled treatment.
// React 18 forwardRef discipline — see Dialog.tsx's header comment.
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';
import { controlClasses, controlStateClass } from './Input';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

type SelectTriggerProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & Readonly<{ hasError?: boolean }>;

export const SelectTrigger = forwardRef<ElementRef<typeof SelectPrimitive.Trigger>, SelectTriggerProps>(
  function SelectTrigger({ className, children, hasError, ...rest }, ref) {
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        aria-invalid={hasError}
        className={cn(
          controlClasses,
          // read-only:bg-card — a <button> matches :read-only, so the shared control
          // classes would otherwise tint it as if it were a locked input.
          'group flex h-9 cursor-pointer items-center justify-between gap-2 text-left read-only:bg-card data-[placeholder]:text-muted-foreground',
          'data-[state=open]:border-ring data-[state=open]:ring-3 data-[state=open]:ring-ring/20 [&>span]:truncate',
          controlStateClass(hasError),
          className,
        )}
        {...rest}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDown
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-smooth group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  },
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent({ className, children, position = 'popper', sideOffset = 6, ...rest }, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        sideOffset={sideOffset}
        className={cn(
          // Capped at 18rem (about seven rows) or the room left on screen, whichever is
          // smaller; past that the viewport below scrolls. Never narrower than the trigger.
          'relative z-50 max-h-[min(18rem,var(--radix-select-content-available-height))] min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...rest}
      >
        {/* select-viewport (index.css) brings back the themed scrollbar Radix hides,
            which is why shadcn's hover-to-scroll arrow buttons aren't rendered here. */}
        <SelectPrimitive.Viewport className="select-viewport overscroll-contain p-1.5">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(function SelectSeparator({ className, ...rest }, ref) {
  return <SelectPrimitive.Separator ref={ref} className={cn('-mx-1.5 my-1.5 h-px bg-border', className)} {...rest} />;
});
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(function SelectItem({ className, children, ...rest }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-3 pr-9 text-sm text-foreground-soft outline-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground data-[state=checked]:font-medium data-[state=checked]:text-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...rest}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      {/* A check mark, not colour alone, marks the current choice (accessibility.md). */}
      <span className="absolute right-3 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4 text-primary" aria-hidden="true" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;
