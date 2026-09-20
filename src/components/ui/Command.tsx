// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// Hand-ported from shadcn's `command` (cmdk). React 18 forwardRef discipline — see
// Dialog.tsx's header comment. cmdk supplies the combobox/listbox semantics,
// filtering and arrow-key/Enter handling; this file only styles it.
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import { cn } from '../../lib/cn';

export const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(function Command({ className, ...rest }, ref) {
  return (
    <CommandPrimitive
      ref={ref}
      className={cn('flex h-full w-full flex-col overflow-hidden bg-card text-card-foreground', className)}
      {...rest}
    />
  );
});
Command.displayName = 'Command';

export const CommandInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(function CommandInput({ className, ...rest }, ref) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border px-4">
      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          'h-13 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
      />
    </div>
  );
});
CommandInput.displayName = 'CommandInput';

export const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(function CommandList({ className, ...rest }, ref) {
  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn('max-h-[min(24rem,60dvh)] scroll-py-2 overflow-y-auto overflow-x-hidden p-2', className)}
      {...rest}
    />
  );
});
CommandList.displayName = 'CommandList';

export const CommandEmpty = forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(function CommandEmpty({ className, ...rest }, ref) {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      className={cn('py-8 text-center text-sm text-muted-foreground', className)}
      {...rest}
    />
  );
});
CommandEmpty.displayName = 'CommandEmpty';

export const CommandGroup = forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(function CommandGroup({ className, ...rest }, ref) {
  return (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        'overflow-hidden p-1 text-foreground',
        '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-display [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-caps [&_[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...rest}
    />
  );
});
CommandGroup.displayName = 'CommandGroup';

export const CommandSeparator = forwardRef<
  ElementRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(function CommandSeparator({ className, ...rest }, ref) {
  return <CommandPrimitive.Separator ref={ref} className={cn('-mx-2 my-1 h-px bg-border', className)} {...rest} />;
});
CommandSeparator.displayName = 'CommandSeparator';

export const CommandItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(function CommandItem({ className, ...rest }, ref) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-foreground-soft outline-none',
        'data-[selected=true]:bg-accent data-[selected=true]:text-foreground',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
        '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground data-[selected=true]:[&_svg]:text-primary',
        className,
      )}
      {...rest}
    />
  );
});
CommandItem.displayName = 'CommandItem';

export function CommandShortcut({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('ml-auto text-xs tracking-wide text-muted-foreground', className)} {...rest} />;
}
