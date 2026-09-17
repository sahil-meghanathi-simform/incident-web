import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useAddNote } from '../../../../src/features/investigation/hooks/useAddNote';
import { queryKeys } from '../../../../src/api/queryKeys';
import { AuthContext } from '../../../../src/app/AuthProvider';
import { ApiError } from '../../../../src/api/ApiError';
import type { NotesPageResponse } from '../../../../src/features/investigation/types/investigation.type';

const { addNoteMock } = vi.hoisted(() => ({ addNoteMock: vi.fn() }));

vi.mock('../../../../src/api/endpoints/investigation.api', () => ({
  addNote: addNoteMock,
}));

const AUTH_USER = { id: 'me-1', email: 'me@test.local', displayName: 'Me', role: 'INVESTIGATOR' as const, clearanceLevel: 3 };

function wrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ status: 'authenticated', user: AUTH_USER, refetch: vi.fn() }}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  };
}

function seededPage(): NotesPageResponse {
  return { items: [], nextCursor: null, hasMore: false };
}

beforeEach(() => {
  addNoteMock.mockReset();
});

describe('useAddNote', () => {
  it('prepends an optimistic note immediately, then settles into the real server note on success', async () => {
    const queryClient = new QueryClient();
    const key = queryKeys.investigations.notes('inc-1');
    queryClient.setQueryData(key, { pages: [seededPage()], pageParams: [undefined] });
    const serverNote = {
      id: 'note-server-1',
      incidentId: 'inc-1',
      author: { id: 'me-1', displayName: 'Me' },
      body: 'Spoke with the shift lead.',
      createdAt: new Date().toISOString(),
    };
    addNoteMock.mockResolvedValueOnce(serverNote);

    const { result } = renderHook(() => useAddNote('inc-1'), { wrapper: wrapper(queryClient) });
    result.current.mutate('Spoke with the shift lead.');

    // The optimistic note is visible synchronously, before the mocked request resolves.
    await waitFor(() => {
      const cached = queryClient.getQueryData<{ pages: NotesPageResponse[] }>(key);
      expect(cached?.pages[0]?.items[0]?.body).toBe('Spoke with the shift lead.');
      expect(cached?.pages[0]?.items[0]?.id).toMatch(/^optimistic-/);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // onSettled invalidates rather than manually reconciling — refetching from a real
    // server would replace the optimistic row with `serverNote`; here it just proves
    // the query was actually marked invalidated, not silently left stale.
    expect(queryClient.getQueryState(key)?.isInvalidated).toBe(true);
  });

  it('rolls back the optimistic note on failure, restoring the exact pre-mutation cache', async () => {
    const queryClient = new QueryClient();
    const key = queryKeys.investigations.notes('inc-1');
    const original = { pages: [seededPage()], pageParams: [undefined] };
    queryClient.setQueryData(key, original);
    addNoteMock.mockRejectedValueOnce(new ApiError({ code: 'INTERNAL', status: 500, message: 'boom', requestId: 'r1' }));

    const { result } = renderHook(() => useAddNote('inc-1'), { wrapper: wrapper(queryClient) });
    result.current.mutate('a note that will fail to save');

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(queryClient.getQueryData(key)).toEqual(original);
  });
});
