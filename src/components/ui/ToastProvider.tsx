// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useCallback, useMemo, type ReactElement, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { ToastContext, type ToastContextValue, type ToastVariant } from './ToastContext';

const SHOW_BY_VARIANT: Readonly<Record<ToastVariant, (message: string) => string>> = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast(message),
};

/**
 * Keeps the app's `useToast().show(message, variant)` API (28 call sites, and the
 * specs that mock it) while rendering through react-hot-toast — so every toast in
 * the app, auth included, looks and behaves the same. The single <HotToaster />
 * mount in AppProviders does the rendering and the screen-reader announcements.
 */
export function ToastProvider({ children }: { children: ReactNode }): ReactElement {
  const show = useCallback((message: string, variant: ToastVariant = 'info') => {
    SHOW_BY_VARIANT[variant](message);
  }, []);
  const value = useMemo<ToastContextValue>(() => ({ show }), [show]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
