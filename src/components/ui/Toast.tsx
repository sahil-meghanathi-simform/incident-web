import { cn } from '../../lib/cn';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
}

const VARIANT_CLASS: Record<ToastVariant, string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-slate-800 text-white',
};

export function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
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
