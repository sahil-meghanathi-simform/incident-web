import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IncidentForm } from '../../../../src/features/incidents/components/IncidentForm';
import { chooseOption } from '../../../helpers/chooseOption';

const TYPE_OPTIONS = [{ value: 'SAFETY' as const, label: 'Safety' }];
const SEVERITY_OPTIONS = [
  { value: 'LOW' as const, label: 'Low' },
  { value: 'CRITICAL' as const, label: 'Critical' },
];

function chooseType(name: string): Promise<void> {
  return chooseOption(screen.getByRole('combobox', { name: /type/i }), name);
}

describe('IncidentForm', () => {
  it('explains an empty submission in plain language, never raw Zod text', async () => {
    const onSubmit = vi.fn();
    render(
      <IncidentForm typeOptions={TYPE_OPTIONS} severityOptions={SEVERITY_OPTIONS} userClearance={1} onSubmit={onSubmit} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /submit report/i }));

    await waitFor(() => expect(screen.getByText(/choose the type that best fits/i)).toBeInTheDocument());
    expect(screen.getByText(/title of at least 5 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/fix the 3 highlighted fields/i)).toBeInTheDocument();
    expect(screen.queryByText(/invalid enum value|string must contain|^required$/i)).not.toBeInTheDocument();
    const typeSelect = screen.getByRole('combobox', { name: /type/i });
    expect(typeSelect).toHaveFocus();
    expect(typeSelect).toHaveAccessibleDescription(/choose the type that best fits/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects submission with a too-short title/description and never calls onSubmit', async () => {
    const onSubmit = vi.fn();
    render(
      <IncidentForm typeOptions={TYPE_OPTIONS} severityOptions={SEVERITY_OPTIONS} userClearance={1} onSubmit={onSubmit} />,
    );

    await chooseType('Safety');
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'hi' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'too short' } });
    fireEvent.click(screen.getByRole('button', { name: /submit report/i }));

    await waitFor(() => expect(screen.getByText(/at least 20 character/i)).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits well-formed values, including the severity chosen via the radio group', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <IncidentForm typeOptions={TYPE_OPTIONS} severityOptions={SEVERITY_OPTIONS} userClearance={4} onSubmit={onSubmit} />,
    );

    await chooseType('Safety');
    fireEvent.click(screen.getByRole('radio', { name: /critical/i }));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'A slip hazard near the dock' } });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Water pooled near the loading dock after overnight cleaning.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit report/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SAFETY',
          severity: 'CRITICAL',
          title: 'A slip hazard near the dock',
        }),
      ),
    );
  });
});
