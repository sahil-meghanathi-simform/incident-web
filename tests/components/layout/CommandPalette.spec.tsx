import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppShellHotkeyHarness } from './commandPaletteHarness';
import { AuthContext, type AuthContextValue } from '../../../src/app/AuthProvider';
import type { SessionUser } from '../../../src/types/auth.type';

// cmdk measures and scrolls its list; jsdom implements neither.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
  Element.prototype.scrollIntoView ??= function scrollIntoView(): void {};
});

function Location() {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
}

function renderPalette(user: SessionUser) {
  const value: AuthContextValue = { user, status: 'authenticated', refetch: () => {} };
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={['/']}>
        <AuthContext.Provider value={value}>
          <Routes>
            <Route path="*" element={<AppShellHotkeyHarness />} />
          </Routes>
          <Location />
        </AuthContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const REPORTER: SessionUser = { id: 'u1', email: 'r@x.com', displayName: 'Rae', role: 'REPORTER', clearanceLevel: 1 };

function openWithHotkey(): void {
  act(() => {
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
  });
}

describe('CommandPalette', () => {
  it('opens on Ctrl+K with only the pages this role can reach', () => {
    renderPalette(REPORTER);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    openWithHotkey();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /My reports/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Users/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Triage queue/ })).not.toBeInTheDocument();
    // Reporting an incident is a dialog opened from the dashboard and the incident
    // lists, not a page to jump to — it never appears as a quick-jump destination.
    expect(screen.queryByRole('option', { name: /^Report incident$/ })).not.toBeInTheDocument();
  });

  it('navigates to a page when an option is chosen', () => {
    renderPalette(REPORTER);
    openWithHotkey();
    fireEvent.click(screen.getByRole('option', { name: /My reports/ }));
    expect(screen.getByTestId('location')).toHaveTextContent('/incidents/mine');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('turns free text into an incident search using the existing ?q= filter', () => {
    renderPalette(REPORTER);
    openWithHotkey();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'loading dock' } });
    fireEvent.click(screen.getByRole('option', { name: /Search incidents for “loading dock”/ }));
    expect(screen.getByTestId('location')).toHaveTextContent('/incidents?q=loading+dock');
  });
});
