import { useCallback, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Toast, type ToastItem, type ToastVariant } from './Toast';
import { ToastContext } from './ToastContext';

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }): ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      counter.current += 1;
      const id = `toast-${counter.current}`;
      setToasts((prev) => [...prev, { id, variant, message }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  // Error toasts interrupt (assertive) — anything else waits for a pause in speech
  // (polite), per accessibility.md's aria-live guidance.
  const liveness = toasts.some((t) => t.variant === 'error') ? 'assertive' : 'polite';

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {createPortal(
        // rules-ok: z-[60] is deliberately above Modal/Drawer's z-50 so a toast stays
        // visible over an open dialog — not worth a dedicated @theme z-index scale for
        // this one ordering constraint (tailwind.md).
        <div aria-live={liveness} className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
