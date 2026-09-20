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
import { LABELS } from '../../lib/labels';

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
        'fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...rest}
    />
  );
});
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

type SheetSide = 'right' | 'left' | 'bottom';

type SheetContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  Readonly<{ side?: SheetSide }>;

const SIDE_CLASS: Readonly<Record<SheetSide, string>> = {
  right:
    'inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
  left: 'inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
  // Mobile filter/action sheets: rises from the bottom, never taller than 85% of
  // the screen, with a grab handle drawn by ::before.
  bottom:
    'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl border-t pt-7 before:absolute before:left-1/2 before:top-2.5 before:h-1 before:w-10 before:-translate-x-1/2 before:rounded-full before:bg-border data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
};

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
            'fixed z-50 flex flex-col overflow-y-auto border-border bg-card p-5 shadow-lg outline-none sm:p-6',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-300 data-[state=open]:ease-smooth',
            SIDE_CLASS[side],
            className,
          )}
          {...rest}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none">
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{LABELS.chrome.sheetClose}</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = DialogPrimitive.Content.displayName;

export function SheetHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-5 flex flex-col gap-1.5 pr-8', className)} {...rest} />;
}

/** Actions pinned to the bottom of the sheet while its body scrolls. */
export function SheetFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        '-mx-5 -mb-5 mt-auto flex flex-col-reverse gap-2 border-t border-border bg-card/95 px-5 py-4 backdrop-blur sm:-mx-6 sm:-mb-6 sm:flex-row sm:justify-end sm:px-6',
        'sticky bottom-0',
        className,
      )}
      {...rest}
    />
  );
}

export const SheetTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('font-display text-lg font-semibold tracking-snug text-foreground', className)}
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
