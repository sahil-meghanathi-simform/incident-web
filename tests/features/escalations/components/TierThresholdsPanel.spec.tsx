import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TierThresholdsPanel } from '../../../../src/features/escalations/components/TierThresholdsPanel';

const { getEscalationTiersMock } = vi.hoisted(() => ({ getEscalationTiersMock: vi.fn() }));

vi.mock('../../../../src/api/endpoints/escalation.api', () => ({
  getEscalationTiers: getEscalationTiersMock,
}));

function renderPanel() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TierThresholdsPanel />
    </QueryClientProvider>,
  );
}

describe('TierThresholdsPanel', () => {
  it('groups tiers by severity and formats thresholds in minutes/hours', async () => {
    getEscalationTiersMock.mockResolvedValueOnce({
      tiers: [
        { severity: 'HIGH', level: 1, thresholdMinutes: 30 },
        { severity: 'HIGH', level: 2, thresholdMinutes: 90 },
        { severity: 'CRITICAL', level: 1, thresholdMinutes: 15 },
      ],
    });

    renderPanel();

    await waitFor(() => expect(screen.getByText(/L1 · 30m/)).toBeInTheDocument());
    expect(screen.getByText(/L2 · 1h 30m/)).toBeInTheDocument();
    expect(screen.getByText(/L1 · 15m/)).toBeInTheDocument();
  });

  it('renders nothing when the request fails, rather than a broken empty-state layout', async () => {
    getEscalationTiersMock.mockRejectedValueOnce(new Error('network down'));
    const { container } = renderPanel();
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
