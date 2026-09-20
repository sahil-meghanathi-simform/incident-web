// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Loader2 } from 'lucide-react';
import { LABELS } from '../../lib/labels';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './AlertDialog';

type ConfirmDialogProps = Readonly<{
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}>;

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = LABELS.chrome.confirm,
  isDanger,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps): ReactElement {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{LABELS.chrome.cancel}</AlertDialogCancel>
          <AlertDialogAction
            destructive={isDanger}
            disabled={isLoading}
            aria-busy={isLoading}
            onClick={(e) => {
              // Confirm here is asynchronous (a mutation) — the caller controls
              // `isOpen` itself and closes it once the mutation settles, so the
              // dialog must NOT auto-close on click the way AlertDialogAction
              // does by default.
              e.preventDefault();
              onConfirm();
            }}
          >
            {isLoading && <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
