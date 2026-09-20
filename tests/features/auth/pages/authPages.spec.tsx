import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthLayout } from '../../../../src/features/auth/components/AuthLayout';
import { LoginPage } from '../../../../src/features/auth/pages/LoginPage';
import { RegisterPage } from '../../../../src/features/auth/pages/RegisterPage';
import { LABELS } from '../../../../src/lib/labels';

function renderAt(path: string): void {
  const router = createMemoryRouter(
    [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
    { initialEntries: [path] },
  );
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

/**
 * Render smoke tests. src/test/setup.ts turns a missing forwardRef or invalid DOM
 * nesting into a thrown failure, so simply mounting these pages guards the ref chain
 * react-hook-form's register() → IconInput → Input and the markup around it.
 */
describe('auth pages', () => {
  afterEach(cleanup);

  it('renders the login form with labelled fields inside the shared layout', () => {
    renderAt('/login');
    expect(screen.getByRole('heading', { level: 1, name: LABELS.auth.loginHeading })).toBeTruthy();
    expect(screen.getByLabelText(LABELS.auth.emailLabel)).toBeTruthy();
    expect(screen.getByLabelText(LABELS.auth.passwordLabel)).toBeTruthy();
    expect(screen.getByRole('button', { name: LABELS.auth.logIn })).toBeTruthy();
    expect(screen.getByRole('region', { name: LABELS.auth.showcase.regionLabel })).toBeTruthy();
  });

  it('toggles password visibility through aria-pressed', () => {
    renderAt('/login');
    const input = screen.getByLabelText(LABELS.auth.passwordLabel);
    const toggle = screen.getByRole('button', { name: LABELS.auth.showPassword });
    expect(input.getAttribute('type')).toBe('password');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(toggle);
    expect(input.getAttribute('type')).toBe('text');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('renders the register form and updates the strength meter as the password changes', () => {
    renderAt('/register');
    expect(screen.getByRole('heading', { level: 1, name: LABELS.auth.registerHeading })).toBeTruthy();
    expect(screen.getByLabelText(LABELS.auth.nameLabel)).toBeTruthy();
    expect(screen.getByText(LABELS.auth.strength.levels.empty)).toBeTruthy();

    fireEvent.change(screen.getByLabelText(LABELS.auth.passwordLabel), { target: { value: 'Test@123' } });
    expect(screen.getByText(LABELS.auth.strength.levels.strong)).toBeTruthy();
  });

  it('moves the showcase to the next highlight from its controls', () => {
    renderAt('/login');
    const slides = LABELS.auth.showcase.slides;
    const dot = (position: number): HTMLElement =>
      screen.getByRole('button', {
        name: LABELS.auth.showcase.goToSlide(position + 1, slides[position]?.title ?? ''),
      });

    expect(dot(0).getAttribute('aria-current')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: LABELS.auth.showcase.next }));
    expect(dot(1).getAttribute('aria-current')).toBe('true');
    expect(dot(0).getAttribute('aria-current')).toBeNull();
  });
});
