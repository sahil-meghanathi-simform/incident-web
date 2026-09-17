import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NoteComposer } from '../../../../src/features/investigation/components/NoteComposer';
import { ToastContext } from '../../../../src/components/ui/ToastContext';
import { AuthContext } from '../../../../src/app/AuthProvider';
import { ApiError } from '../../../../src/api/ApiError';

const { addNoteMock } = vi.hoisted(() => ({ addNoteMock: vi.fn() }));

vi.mock('../../../../src/api/endpoints/investigation.api', () => ({
  addNote: addNoteMock,
}));

const AUTH_USER = { id: 'me-1', email: 'me@test.local', displayName: 'Me', role: 'INVESTIGATOR' as const, clearanceLevel: 3 };

function renderComposer(show = vi.fn()) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ status: 'authenticated', user: AUTH_USER, refetch: vi.fn() }}>
        <ToastContext.Provider value={{ show }}>
          <NoteComposer incidentId="inc-1" />
        </ToastContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  addNoteMock.mockReset();
});

describe('NoteComposer', () => {
  it('disables submit once the body exceeds 4000 characters', () => {
    renderComposer();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a'.repeat(4001) } });
    expect(screen.getByRole('button', { name: /add note/i })).toBeDisabled();
    expect(screen.getByText('4001 / 4000')).toBeInTheDocument();
  });

  it('submits, clears the textarea, and shows a success toast', async () => {
    const show = vi.fn();
    addNoteMock.mockResolvedValueOnce({
      id: 'note-1',
      incidentId: 'inc-1',
      author: { id: 'me-1', displayName: 'Me' },
      body: 'Interviewed the shift supervisor.',
      createdAt: new Date().toISOString(),
    });
    renderComposer(show);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Interviewed the shift supervisor.' } });
    fireEvent.click(screen.getByRole('button', { name: /add note/i }));

    await waitFor(() => expect(addNoteMock).toHaveBeenCalledWith('inc-1', { body: 'Interviewed the shift supervisor.' }));
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue(''));
    expect(show).toHaveBeenCalledWith(expect.stringMatching(/note added/i), 'success');
  });

  it('a NOTES_CLOSED refusal shows an inline notice, disables the composer, and preserves the typed text', async () => {
    addNoteMock.mockRejectedValueOnce(
      new ApiError({
        code: 'INVALID_STAGE_TRANSITION',
        status: 409,
        message: 'Notes can only be added while an incident is under investigation.',
        requestId: 'r1',
        meta: { stage: 'CLOSED', reason: 'NOTES_CLOSED' },
      }),
    );
    renderComposer();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a note written just as it closed' } });
    fireEvent.click(screen.getByRole('button', { name: /add note/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/notes can no longer be added/i));
    expect(screen.getByRole('textbox')).toHaveValue('a note written just as it closed');
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: /add note/i })).toBeDisabled();
  });
});
