import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClearanceNotice } from '../../../../src/features/incidents/components/ClearanceNotice';

describe('ClearanceNotice', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it('copies the reference to the clipboard and shows confirmation', async () => {
    render(<ClearanceNotice reference="INC-2026-000123" />);

    fireEvent.click(screen.getByRole('button', { name: /copy reference/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument());
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('INC-2026-000123');
  });
});
