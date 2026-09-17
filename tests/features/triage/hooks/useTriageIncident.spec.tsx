import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useTriageIncident } from '../../../../src/features/triage/hooks/useTriageIncident';
import { queryKeys } from '../../../../src/api/queryKeys';

vi.mock('../../../../src/api/endpoints/triage.api', () => ({
  triageIncident: vi.fn().mockResolvedValue({ id: 'inc-1', stage: 'TRIAGE', version: 1 }),
}));

function wrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useTriageIncident', () => {
  it('invalidates the incident list, this incident’s detail, and the triage queue on success', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.incidents.all, { items: ['stale-list'] });
    queryClient.setQueryData(queryKeys.incidents.detail('inc-1'), { id: 'inc-1', stage: 'REPORTED', version: 0 });
    queryClient.setQueryData(queryKeys.triage.queue({ page: 1 }), { items: ['stale-queue'] });

    const { result } = renderHook(() => useTriageIncident('inc-1'), { wrapper: wrapper(queryClient) });
    result.current.mutate(0);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryState(queryKeys.incidents.all)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(queryKeys.incidents.detail('inc-1'))?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(queryKeys.triage.queue({ page: 1 }))?.isInvalidated).toBe(true);
  });
});
