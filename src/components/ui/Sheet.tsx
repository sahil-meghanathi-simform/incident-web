// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// Built on @radix-ui/react-dialog (already a dependency for Dialog.tsx) — a
// sheet is a dialog with a slide-in-from-the-edge placement, not a distinct
// Radix primitive. React 18 forwardRef discipline — see Dialog.tsx.
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useRestoreFocusOnClose } from '../../hooks/useRestoreFocusOnClose';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetPortal = DialogPrimitive.Portal;
export const SheetClose = DialogPrimitive.Close;

const SheetOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function SheetOverlay({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...rest}
    />
  );
});
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

type SheetContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  Readonly<{ side?: 'right' | 'left' }>;

export const SheetContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, SheetContentProps>(
  function SheetContent({ className, children, side = 'right', onCloseAutoFocus, ...rest }, ref) {
    const restoreFocus = useRestoreFocusOnClose();
    return (
      <SheetPortal>
        <SheetOverlay />
        <DialogPrimitive.Content
          ref={ref}
          onCloseAutoFocus={onCloseAutoFocus ?? restoreFocus}
          className={cn(
            'fixed inset-y-0 z-50 h-full w-full max-w-md overflow-y-auto border-border bg-card p-5 shadow-lg outline-none',
            side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
            side === 'right'
              ? 'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right'
              : 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
            className,
          )}
          {...rest}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none">
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = DialogPrimitive.Content.displayName;

export function SheetHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 flex flex-col gap-1.5', className)} {...rest} />;
}

export const SheetTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('font-display text-base font-semibold tracking-snug text-foreground', className)}
      {...rest}
    />
  );
});
SheetTitle.displayName = DialogPrimitive.Title.displayName;

export const SheetDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function SheetDescription({ className, ...rest }, ref) {
  return <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...rest} />;
});
SheetDescription.displayName = DialogPrimitive.Description.displayName;
