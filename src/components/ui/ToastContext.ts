import { createContext } from 'react';
import type { ToastVariant } from './Toast';

export type ToastContextValue = Readonly<{
  show: (message: string, variant?: ToastVariant) => void;
}>;

export const ToastContext = createContext<ToastContextValue | null>(null);
