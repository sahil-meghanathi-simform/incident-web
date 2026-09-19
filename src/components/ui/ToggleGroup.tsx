// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// React 18 forwardRef discipline — see Dialog.tsx's header comment. Note this
// hook trips the naming check's `useContext(` scan (ToggleGroupPrimitive.Item
// reads shared state from its Root via context internally) — that's Radix's
// own implementation, not a project state-management violation.
// rules-ok: state-management.md — Radix's own ToggleGroupPrimitive internals use
// useContext; this file only renders the primitive, it doesn't call useContext itself.
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '../../lib/cn';

export const ToggleGroup = ToggleGroupPrimitive.Root;

export const ToggleGroupItem = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(function ToggleGroupItem({ className, ...rest }, ref) {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-foreground-soft transition-colors',
        'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
        className,
      )}
      {...rest}
    />
  );
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
