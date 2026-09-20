import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../../../src/components/ui/ToastProvider';
import { useToast } from '../../../src/components/ui/useToast';

const hot = vi.hoisted(() => {
  const base = vi.fn();
  return Object.assign(base, { success: vi.fn(), error: vi.fn() });
});

vi.mock('react-hot-toast', () => ({ toast: hot }));

function Trigger({ variant }: { variant?: 'success' | 'error' | 'info' }) {
  const { show } = useToast();
  return (
    <button type="button" onClick={() => show('Saved.', variant)}>
      fire
    </button>
  );
}

describe('ToastProvider', () => {
  beforeEach(() => {
    hot.mockClear();
    hot.success.mockClear();
    hot.error.mockClear();
  });

  it.each([
    ['success', 'success'],
    ['error', 'error'],
  ] as const)('routes a %s toast to react-hot-toast', (variant, method) => {
    render(
      <ToastProvider>
        <Trigger variant={variant} />
      </ToastProvider>,
    );
    screen.getByRole('button', { name: 'fire' }).click();
    expect(hot[method]).toHaveBeenCalledWith('Saved.');
  });

  it('treats a toast with no variant as info', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    screen.getByRole('button', { name: 'fire' }).click();
    expect(hot).toHaveBeenCalledWith('Saved.');
    expect(hot.success).not.toHaveBeenCalled();
    expect(hot.error).not.toHaveBeenCalled();
  });
});
