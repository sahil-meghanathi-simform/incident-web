import type { ReactElement } from 'react';
import { cn } from '../../lib/cn';

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastItem = Readonly<{
  id: string;
  variant: ToastVariant;
  message: string;
}>;

const VARIANT_CLASS: Record<ToastVariant, string> = {
  success: 'bg-stage-closed text-primary-foreground',
  error: 'bg-destructive text-destructive-foreground',
  info: 'bg-brand-deep text-primary-foreground',
};

export function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }): ReactElement {
  return (
    <div
      role="status"
      className={cn('flex items-center justify-between gap-3 rounded-md px-4 py-2.5 text-sm shadow-lg', VARIANT_CLASS[toast.variant])}
    >
      <span>{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} aria-label="Dismiss" className="opacity-80 hover:opacity-100">
        ×
      </button>
    </div>
  );
}
