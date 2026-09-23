import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { UserMenu } from '../../../src/components/layout/UserMenu';
import { LogoutConfirmProvider } from '../../../src/features/auth/components/LogoutConfirmProvider';
import { logoutRequest } from '../../../src/api/endpoints/auth.api';
import type { SessionUser } from '../../../src/types/auth.type';

vi.mock('../../../src/api/endpoints/auth.api', () => ({
  logoutRequest: vi.fn().mockResolvedValue(undefined),
}));

const USER: SessionUser = {
  id: 'u1',
  email: 'r@x.com',
  displayName: 'Rae',
  role: 'REPORTER',
  clearanceLevel: 1,
};

function Location() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

function renderUserMenu() {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={['/']}>
        <LogoutConfirmProvider>
          <Routes>
            <Route path="*" element={<UserMenu user={USER} />} />
          </Routes>
          <Location />
        </LogoutConfirmProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

async function openMenuAndClickLogout(): Promise<void> {
  const trigger = screen.getByRole('button', { name: /account menu/i });
  fireEvent.keyDown(trigger, { key: 'Enter' });
  fireEvent.click(await screen.findByRole('menuitem', { name: /log out/i }));
}

describe('UserMenu — logout confirmation', () => {
  it('asks for confirmation instead of logging out immediately', async () => {
    renderUserMenu();
    await openMenuAndClickLogout();

    expect(await screen.findByRole('alertdialog', { name: /log out\?/i })).toBeInTheDocument();
    expect(logoutRequest).not.toHaveBeenCalled();
  });

  it('stays logged in when the prompt is cancelled', async () => {
    renderUserMenu();
    await openMenuAndClickLogout();
    await screen.findByRole('alertdialog');

    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(logoutRequest).not.toHaveBeenCalled();
    expect(screen.getByTestId('location')).toHaveTextContent('/');
  });

  it('logs out and redirects to login once confirmed', async () => {
    renderUserMenu();
    await openMenuAndClickLogout();
    await screen.findByRole('alertdialog');

    fireEvent.click(screen.getByRole('button', { name: /^log out$/i }));

    await waitFor(() => expect(logoutRequest).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login'));
  });
});
