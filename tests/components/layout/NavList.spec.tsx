import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavList } from '../../../src/components/layout/NavList';
import { useNavGroups } from '../../../src/hooks/useNavGroups';
import { AuthContext, type AuthContextValue } from '../../../src/app/AuthProvider';
import type { SessionUser } from '../../../src/types/auth.type';

function NavForCurrentUser({ isCollapsed = false }: { isCollapsed?: boolean }) {
  return <NavList groups={useNavGroups()} isCollapsed={isCollapsed} />;
}

function renderNav(user: SessionUser, path: string, isCollapsed = false) {
  const value: AuthContextValue = { user, status: 'authenticated', refetch: () => {} };
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthContext.Provider value={value}>
        <NavForCurrentUser isCollapsed={isCollapsed} />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

const REPORTER: SessionUser = { id: 'u1', email: 'r@x.com', displayName: 'Rae', role: 'REPORTER', clearanceLevel: 1 };
const ADMIN: SessionUser = { id: 'u2', email: 'a@x.com', displayName: 'Ada', role: 'ADMIN', clearanceLevel: 4 };
const TRIAGE_MANAGER: SessionUser = {
  id: 'u3',
  email: 't@x.com',
  displayName: 'Tia',
  role: 'TRIAGE_MANAGER',
  clearanceLevel: 4,
};
const INVESTIGATOR: SessionUser = {
  id: 'u4',
  email: 'i@x.com',
  displayName: 'Ivo',
  role: 'INVESTIGATOR',
  clearanceLevel: 4,
};

describe('NavList', () => {
  it('marks only the matching item as the current page', () => {
    renderNav(REPORTER, '/incidents/mine');
    expect(screen.getByRole('link', { name: 'My reports' })).toHaveAttribute('aria-current', 'page');
    // "Incidents" is a prefix of /incidents/mine but excludes it, so it isn't also current.
    expect(screen.getByRole('link', { name: 'Incidents' })).not.toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current', 'page');
  });

  it('marks Dashboard current only on the exact home path', () => {
    renderNav(REPORTER, '/');
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  });

  it('hides admin and work items from a reporter', () => {
    renderNav(REPORTER, '/');
    expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Triage queue' })).not.toBeInTheDocument();
  });

  it('shows admin items to an administrator', () => {
    renderNav(ADMIN, '/');
    expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('href', '/admin/users');
    expect(screen.getByRole('link', { name: 'Audit log' })).toBeInTheDocument();
  });

  it('centres the collapsed icons and highlights only the current item', () => {
    // Regression: the collapsed rail's Tooltip (Radix Slot) once stringified NavLink's
    // className function, so no link got justify-center and every link got the ring.
    renderNav(ADMIN, '/', true);
    const dashboard = screen.getByRole('link', { name: 'Dashboard' });
    const analytics = screen.getByRole('link', { name: 'Analytics' });
    expect(dashboard).toHaveClass('justify-center', 'ring-1');
    expect(analytics).toHaveClass('justify-center');
    expect(analytics).not.toHaveClass('ring-1');
    expect(analytics.className).not.toContain('=>');
  });

  it('keeps every link named when collapsed to icons', () => {
    renderNav(ADMIN, '/', true);
    expect(screen.getByRole('link', { name: 'Analytics' })).toHaveAttribute('href', '/analytics');
    expect(screen.getByRole('link', { name: 'Incidents' })).toBeInTheDocument();
  });

  // Reporting an incident is a dialog opened from the dashboard, the incident
  // lists and their empty states — not a sidebar destination — for every role.
  it.each([
    ['a reporter', REPORTER],
    ['a triage manager', TRIAGE_MANAGER],
    ['an investigator', INVESTIGATOR],
    ['an administrator', ADMIN],
  ])('never shows Report incident in the sidebar for %s', (_label, user) => {
    renderNav(user, '/');
    expect(screen.queryByText('Report incident')).not.toBeInTheDocument();
  });
});
