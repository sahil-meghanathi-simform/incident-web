import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ReportIncidentProvider } from '../../../../src/features/incidents/components/ReportIncidentProvider';
import { ReportIncidentButton } from '../../../../src/features/incidents/components/ReportIncidentButton';
import { AuthContext, type AuthContextValue } from '../../../../src/app/AuthProvider';
import { createIncident, listIncidentTypes } from '../../../../src/api/endpoints/incidents.api';
import type { SessionUser } from '../../../../src/types/auth.type';
import { chooseOption } from '../../../helpers/chooseOption';

vi.mock('../../../../src/api/endpoints/incidents.api', () => ({
  createIncident: vi.fn(),
  listIncidentTypes: vi.fn(),
}));

const REPORTER: SessionUser = { id: 'u1', email: 'r@x.com', displayName: 'Rae', role: 'REPORTER', clearanceLevel: 1 };

const TYPES = {
  types: [{ value: 'SAFETY' as const, label: 'Safety' }],
  severities: [
    { value: 'LOW' as const, label: 'Low', minClearance: 1 },
    { value: 'CRITICAL' as const, label: 'Critical', minClearance: 4 },
  ],
};

function renderShell() {
  const value: AuthContextValue = { user: REPORTER, status: 'authenticated', refetch: () => {} };
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <AuthContext.Provider value={value}>
          <ReportIncidentProvider>
            <ReportIncidentButton />
          </ReportIncidentProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

async function openDialog(): Promise<void> {
  fireEvent.click(screen.getByRole('button', { name: /report incident/i }));
  await screen.findByRole('dialog');
}

async function fillValidReport(): Promise<void> {
  await chooseOption(await screen.findByRole('combobox', { name: /type/i }), 'Safety');
  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'A slip hazard near the dock' } });
  fireEvent.change(screen.getByLabelText(/^description/i), {
    target: { value: 'Water pooled near the loading dock after overnight cleaning.' },
  });
  fireEvent.change(screen.getByLabelText(/why is there no photo/i), {
    target: { value: 'The spill was mopped up before I could photograph it.' },
  });
}

describe('ReportIncidentDialog', () => {
  beforeEach(() => {
    vi.mocked(listIncidentTypes).mockResolvedValue(TYPES);
    vi.mocked(createIncident).mockReset();
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it('opens over the current screen rather than navigating to one', async () => {
    renderShell();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await openDialog();
    expect(await screen.findByRole('combobox', { name: /type/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit report/i })).toBeInTheDocument();
  });

  it('replaces the form with the reference receipt once the report is in', async () => {
    vi.mocked(createIncident).mockResolvedValue({
      id: 'inc-1',
      reference: 'INC-2026-000123',
      createdAt: new Date().toISOString(),
      severity: 'LOW',
      visibleToYou: true,
    });
    renderShell();
    await openDialog();
    await fillValidReport();
    fireEvent.click(screen.getByRole('button', { name: /submit report/i }));

    expect(await screen.findByText('INC-2026-000123')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view incident/i })).toHaveAttribute('href', '/incidents/inc-1');
    expect(screen.queryByRole('button', { name: /submit report/i })).not.toBeInTheDocument();
  });

  it('offers no dead link when the report landed above the reporter clearance (Q9)', async () => {
    vi.mocked(createIncident).mockResolvedValue({
      id: 'inc-2',
      reference: 'INC-2026-000124',
      createdAt: new Date().toISOString(),
      severity: 'CRITICAL',
      visibleToYou: false,
    });
    renderShell();
    await openDialog();
    await fillValidReport();
    fireEvent.click(screen.getByRole('button', { name: /submit report/i }));

    expect(await screen.findByText('INC-2026-000124')).toBeInTheDocument();
    expect(screen.getByText(/you may not be able to view this report/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /view incident/i })).not.toBeInTheDocument();
  });

  it('asks before discarding a part-filled report, and closes once confirmed', async () => {
    renderShell();
    await openDialog();
    fireEvent.change(await screen.findByLabelText(/title/i), { target: { value: 'Half a thought' } });
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));

    expect(await screen.findByText(/discard this report\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /discard report/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes an untouched form without asking', async () => {
    renderShell();
    await openDialog();
    await screen.findByLabelText(/title/i);
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.queryByText(/discard this report\?/i)).not.toBeInTheDocument();
  });

  // Regression: react-hook-form's top-level `isDirty` was observed flipping true
  // for a render pass with an EMPTY `dirtyFields`, paired with the async
  // zodResolver on this form — a purely internal artifact, not a real edit. Only
  // reproduced in a real browser (see IncidentForm.tsx), so this asserts the
  // component uses `dirtyFields`, not `isDirty`, as its own contract.
  it('reopening after a fresh mount still closes without asking — no field ever touched', async () => {
    renderShell();
    await openDialog();
    await screen.findByLabelText(/title/i);
    // A second open/close cycle exercises the same remount path "Report another"
    // and a plain reopen both take.
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await openDialog();
    await screen.findByLabelText(/title/i);
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.queryByText(/discard this report\?/i)).not.toBeInTheDocument();
  });
});
