// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { queryClient } from './queryClient';
import { ToastProvider } from '../components/ui/ToastProvider';
import { HotToaster } from '../components/ui/HotToaster';
import { AuthProvider } from './AuthProvider';

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

/** QueryClientProvider + ToastProvider + AuthProvider + Radix's TooltipProvider
 * (shared delay/skip-delay behavior for every Tooltip in the app) — composition
 * only, no feature logic. */
export function AppProviders({ children }: AppProvidersProps): ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
          <HotToaster />
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
