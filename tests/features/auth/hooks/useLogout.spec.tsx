import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useLogout } from '../../../../src/features/auth/hooks/useLogout';

vi.mock('../../../../src/api/endpoints/auth.api', () => ({
  logoutRequest: vi.fn().mockResolvedValue(undefined),
}));

function wrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useLogout', () => {
  it('clears the entire query cache on settle, not just the session key (security.md)', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['session'], { id: 'u1' });
    queryClient.setQueryData(['incidents', 'list', {}], { items: ['leftover-from-previous-user'] });

    const { result } = renderHook(() => useLogout(), { wrapper: wrapper(queryClient) });
    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(['session'])).toBeUndefined();
    expect(queryClient.getQueryData(['incidents', 'list', {}])).toBeUndefined();
  });
});
