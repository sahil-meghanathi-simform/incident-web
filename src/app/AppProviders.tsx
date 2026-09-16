import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { ToastProvider } from '../components/ui/ToastProvider';

/**
 * QueryClientProvider + ToastProvider. AuthProvider is added here in Module 1 once
 * session/auth context exists — composition-only, no feature logic.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
