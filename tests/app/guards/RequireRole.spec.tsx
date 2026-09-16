import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RequireRole } from '../../../src/app/guards/RequireRole';
import { AuthContext, type AuthContextValue } from '../../../src/app/AuthProvider';

function renderWithAuth(value: AuthContextValue) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={value}>
        <RequireRole roles={['TRIAGE_MANAGER', 'ADMIN']}>Allowed content</RequireRole>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe('RequireRole', () => {
  it('renders Forbidden in place for a role not in the allow-list (never a redirect)', () => {
    const user = { id: 'u1', email: 'a@b.com', displayName: 'A', role: 'REPORTER' as const, clearanceLevel: 1 };
    renderWithAuth({ user, status: 'authenticated', refetch: () => {} });
    expect(screen.getByText(/don't have access/i)).toBeInTheDocument();
    expect(screen.queryByText('Allowed content')).not.toBeInTheDocument();
  });

  it('renders children for a role in the allow-list', () => {
    const user = { id: 'u2', email: 'm@b.com', displayName: 'M', role: 'TRIAGE_MANAGER' as const, clearanceLevel: 3 };
    renderWithAuth({ user, status: 'authenticated', refetch: () => {} });
    expect(screen.getByText('Allowed content')).toBeInTheDocument();
  });
});
