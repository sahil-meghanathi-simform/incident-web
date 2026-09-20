// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { createContext } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastContextValue = Readonly<{
  show: (message: string, variant?: ToastVariant) => void;
}>;

export const ToastContext = createContext<ToastContextValue | null>(null);
