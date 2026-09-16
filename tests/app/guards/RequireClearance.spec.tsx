import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RequireClearance } from '../../../src/app/guards/RequireClearance';
import { AuthContext, type AuthContextValue } from '../../../src/app/AuthProvider';

function renderWithAuth(value: AuthContextValue) {
  return render(
    <AuthContext.Provider value={value}>
      <RequireClearance minLevel={3} fallback={<span>Hidden</span>}>
        <span>Visible</span>
      </RequireClearance>
    </AuthContext.Provider>,
  );
}

describe('RequireClearance — optimistic UI only', () => {
  it('renders the fallback below the required clearance', () => {
    const user = { id: 'u1', email: 'a@b.com', displayName: 'A', role: 'REPORTER' as const, clearanceLevel: 1 };
    renderWithAuth({ user, status: 'authenticated', refetch: () => {} });
    expect(screen.getByText('Hidden')).toBeInTheDocument();
    expect(screen.queryByText('Visible')).not.toBeInTheDocument();
  });

  it('renders children at or above the required clearance', () => {
    const user = { id: 'u2', email: 'a@b.com', displayName: 'A', role: 'ADMIN' as const, clearanceLevel: 4 };
    renderWithAuth({ user, status: 'authenticated', refetch: () => {} });
    expect(screen.getByText('Visible')).toBeInTheDocument();
  });
});
