import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { ToastProvider } from '../components/ui/ToastProvider';
import { AuthProvider } from './AuthProvider';

/** QueryClientProvider + ToastProvider + AuthProvider — composition-only, no feature logic. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
