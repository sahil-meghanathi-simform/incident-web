import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EditUserDrawer } from '../../../../src/features/admin/components/EditUserDrawer';
import { ToastContext } from '../../../../src/components/ui/ToastContext';
import { AuthContext, type AuthContextValue } from '../../../../src/app/AuthProvider';
import { ApiError } from '../../../../src/api/ApiError';
import type { AdminUserRow } from '../../../../src/api/contracts/admin.contract';
import { chooseOption } from '../../../helpers/chooseOption';

const {
  changeUserRoleMock,
  changeUserClearanceMock,
  toggleUserStatusMock,
  previewClearanceImpactMock,
} = vi.hoisted(() => ({
  changeUserRoleMock: vi.fn(),
  changeUserClearanceMock: vi.fn(),
  toggleUserStatusMock: vi.fn(),
  previewClearanceImpactMock: vi.fn(),
}));

vi.mock('../../../../src/api/endpoints/admin.api', () => ({
  changeUserRole: changeUserRoleMock,
  changeUserClearance: changeUserClearanceMock,
  toggleUserStatus: toggleUserStatusMock,
  previewClearanceImpact: previewClearanceImpactMock,
}));

function adminUserRow(overrides: Partial<AdminUserRow> = {}): AdminUserRow {
  return {
    id: 'user-1',
    email: 'user1@test.local',
    displayName: 'User One',
    role: 'INVESTIGATOR',
    clearanceLevel: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function renderDrawer(user: AdminUserRow | null, currentUser: AuthContextValue['user'], show = vi.fn()) {
  const queryClient = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ user: currentUser, status: 'authenticated', refetch: vi.fn() }}>
          <ToastContext.Provider value={{ show }}>
            <EditUserDrawer user={user} onClose={vi.fn()} />
          </ToastContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('EditUserDrawer — build-plan.md §15.1/§15.2', () => {
  beforeEach(() => {
    changeUserRoleMock.mockReset();
    changeUserClearanceMock.mockReset();
    toggleUserStatusMock.mockReset();
    previewClearanceImpactMock.mockReset();
  });

  it('disables role and clearance editing for the current actor\'s own row, but not the status toggle', () => {
    const self = adminUserRow({ id: 'admin-1', role: 'ADMIN' });
    renderDrawer(self, { id: 'admin-1', email: 'admin-1@test.local', displayName: 'Admin One', role: 'ADMIN', clearanceLevel: 4 });

    expect(screen.getByLabelText(/role/i)).toBeDisabled();
    expect(screen.getByLabelText(/clearance level/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /deactivate/i })).toBeEnabled();
    expect(screen.getByText(/cannot change your own role or clearance/i)).toBeInTheDocument();
  });

  it('surfaces a 409 LAST_ADMIN role-change refusal inline, in plain language, not just as a toast', async () => {
    changeUserRoleMock.mockRejectedValueOnce(
      new ApiError({ code: 'LAST_ADMIN', status: 409, message: 'raw', requestId: 'req-1' }),
    );
    const target = adminUserRow({ id: 'target-1', role: 'ADMIN' });
    renderDrawer(target, { id: 'admin-1', email: 'admin-1@test.local', displayName: 'Admin One', role: 'ADMIN', clearanceLevel: 4 });

    await chooseOption(screen.getByLabelText(/role/i), /triage manager/i);
    fireEvent.click(screen.getByRole('button', { name: /save role/i }));

    await waitFor(() => {
      expect(screen.getByText(/last active administrator cannot be demoted/i)).toBeInTheDocument();
    });
  });

  it('a clearance LOWERING opens the impact dialog with the preview result, and only PATCHes after Confirm', async () => {
    previewClearanceImpactMock.mockResolvedValueOnce({
      affectedIncidents: [{ id: 'inc-1', reference: 'INC-2026-000001', severity: 'CRITICAL' }],
      count: 1,
    });
    changeUserClearanceMock.mockResolvedValueOnce({
      user: adminUserRow({ id: 'target-1', clearanceLevel: 2 }),
      affectedIncidentCount: 1,
    });
    const target = adminUserRow({ id: 'target-1', clearanceLevel: 4 });
    renderDrawer(target, { id: 'admin-1', email: 'admin-1@test.local', displayName: 'Admin One', role: 'ADMIN', clearanceLevel: 4 });

    await chooseOption(screen.getByLabelText(/clearance level/i), /2/);
    fireEvent.click(screen.getByRole('button', { name: /save clearance/i }));

    // The PATCH must not fire yet — only the read-only preview.
    expect(changeUserClearanceMock).not.toHaveBeenCalled();

    await waitFor(() => expect(screen.getByText('INC-2026-000001')).toBeInTheDocument());
    expect(previewClearanceImpactMock).toHaveBeenCalledWith('target-1', 2);

    fireEvent.click(screen.getByRole('button', { name: /confirm change/i }));

    await waitFor(() => expect(changeUserClearanceMock).toHaveBeenCalledWith('target-1', 2));
  });
});
