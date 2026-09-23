// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// The app's second dialog shape, beside Dialog.tsx's DialogContent. That one is a
// centred card sized for a short confirmation; this one hosts a whole task — a
// multi-section form with its own scroll region and a bar of actions that stays
// put. Below sm it takes the entire screen, because a 2rem-inset card would leave
// a long form scrolling inside a letterbox on a phone; from sm up it becomes a
// centred panel. React 18 ref discipline and the Radix parts come from Dialog.tsx.
import type { ReactElement, ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, type LucideIcon } from 'lucide-react';
import { Dialog, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from './Dialog';
import { useRestoreFocusOnClose } from '../../hooks/useRestoreFocusOnClose';
import { cn } from '../../lib/cn';
import { LABELS } from '../../lib/labels';

type FormDialogSize = 'md' | 'lg';

type FormDialogProps = Readonly<{
  isOpen: boolean;
  title: string;
  description: string;
  icon?: LucideIcon;
  /** Panel width from sm up — below that every size is full-screen. */
  size?: FormDialogSize;
  /** Actions pinned under the scrolling body. A form supplies its own bar inside
   * `children` instead, so its submit button stays inside its `<form>`. */
  footer?: ReactNode;
  children: ReactNode;
  /** Escape, the close button, or a footer cancel — the caller decides whether the
   * dialog may actually go (an unsaved form can ask first). A click on the scrim
   * never reaches here: it is ignored outright. */
  onClose: () => void;
}>;

const SIZE_CLASS: Readonly<Record<FormDialogSize, string>> = {
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
};

/** The bar pinned to the bottom of a FormDialog. Exported so a form's own submit
 * bar — which has to live inside the `<form>`, not in the `footer` slot — matches
 * the dialog's footer exactly instead of re-deriving the recipe (components.md).
 * The bottom padding clears a phone's home indicator when the dialog is
 * full-screen; on a desktop panel `env()` resolves to 0 and it is a plain 1rem. */
export const dialogFooterClass =
  'border-t border-border bg-muted px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6';

export function FormDialog({
  isOpen,
  title,
  description,
  icon: Icon,
  size = 'lg',
  footer,
  children,
  onClose,
}: FormDialogProps): ReactElement {
  const restoreFocus = useRestoreFocusOnClose();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          onCloseAutoFocus={restoreFocus}
          // A half-written report is far too easy to lose to a stray click on the
          // scrim, so only an explicit dismissal closes this dialog.
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          className={cn(
            'fixed inset-0 z-50 flex h-dvh w-full flex-col overflow-hidden bg-card outline-none',
            'sm:bottom-auto sm:right-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:w-[calc(100%-3rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border sm:border-border sm:shadow-lg',
            SIZE_CLASS[size],
            'duration-200 ease-smooth data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 motion-reduce:animate-none sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95',
          )}
        >
          <header className="flex shrink-0 items-start gap-3 border-b border-border px-5 pb-4 pr-14 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-4">
            {Icon && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0 space-y-1">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

          {footer && <footer className={cn('shrink-0', dialogFooterClass)}>{footer}</footer>}

          <DialogPrimitive.Close className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none sm:top-3">
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">{LABELS.chrome.dialogClose}</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
