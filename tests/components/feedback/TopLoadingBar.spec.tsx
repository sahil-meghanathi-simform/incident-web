import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { TopLoadingBar } from '../../../src/components/feedback/TopLoadingBar';

function SlowQuery({ resolveRef }: { resolveRef: { current: (() => void) | null } }) {
  useQuery({
    queryKey: ['slow'],
    queryFn: () =>
      new Promise<string>((resolve) => {
        resolveRef.current = () => resolve('done');
      }),
  });
  return null;
}

describe('TopLoadingBar', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing while idle', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <TopLoadingBar />
      </QueryClientProvider>,
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('appears only after a request has been running for a moment, then clears', async () => {
    vi.useFakeTimers();
    const resolveRef: { current: (() => void) | null } = { current: null };
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SlowQuery resolveRef={resolveRef} />
        <TopLoadingBar />
      </QueryClientProvider>,
    );

    // Quick work never flashes the bar.
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(250);
    });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Settle the request first so React re-renders with isFetching=false and the
    // hide timer is scheduled, then let the minimum-visible window run out.
    await act(async () => {
      resolveRef.current?.();
      await vi.advanceTimersByTimeAsync(0);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
