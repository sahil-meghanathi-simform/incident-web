import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from '../../../src/app/guards/RequireAuth';
import { AuthContext, type AuthContextValue } from '../../../src/app/AuthProvider';

function renderWithAuth(value: AuthContextValue, initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthContext.Provider value={value}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/incidents/:id" element={<RequireAuth>Secret content</RequireAuth>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe('RequireAuth', () => {
  it('redirects an anonymous visitor to /login?next=<original path+search>', () => {
    renderWithAuth({ user: null, status: 'anonymous', refetch: () => {} }, '/incidents/42?tab=notes');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children once authenticated', () => {
    const user = { id: 'u1', email: 'a@b.com', displayName: 'A', role: 'REPORTER' as const, clearanceLevel: 1 };
    renderWithAuth({ user, status: 'authenticated', refetch: () => {} }, '/incidents/42');
    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });

  it('shows a splash loader while status is loading, without redirecting', () => {
    renderWithAuth({ user: null, status: 'loading', refetch: () => {} }, '/incidents/42');
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });
});
