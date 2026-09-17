import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useProposeClosure } from '../../../../src/features/closure/hooks/useProposeClosure';
import { queryKeys } from '../../../../src/api/queryKeys';

vi.mock('../../../../src/api/endpoints/closure.api', () => ({
  proposeClosure: vi.fn().mockResolvedValue({ id: 'inc-1', stage: 'PENDING_CLOSURE', version: 1 }),
}));

function wrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useProposeClosure', () => {
  it('invalidates the incident list, this incident’s detail, and the closures queue on success', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.incidents.all, { items: ['stale-list'] });
    queryClient.setQueryData(queryKeys.incidents.detail('inc-1'), { id: 'inc-1', stage: 'INVESTIGATION', version: 0 });
    queryClient.setQueryData(queryKeys.closures.pending({ page: 1 }), { items: ['stale-queue'] });

    const { result } = renderHook(() => useProposeClosure('inc-1'), { wrapper: wrapper(queryClient) });
    result.current.mutate({
      version: 0,
      body: { rootCause: 'A'.repeat(20), correctiveAction: 'B'.repeat(20) },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryState(queryKeys.incidents.all)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(queryKeys.incidents.detail('inc-1'))?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(queryKeys.closures.pending({ page: 1 }))?.isInvalidated).toBe(true);
  });
});
