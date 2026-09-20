import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptionSelect } from '../../../src/components/ui/OptionSelect';
import { Field } from '../../../src/components/ui/Field';
import { CharacterCount } from '../../../src/components/ui/CharacterCount';
import { TablePagination } from '../../../src/components/ui/TablePagination';
import { chooseOption } from '../../helpers/chooseOption';

const SEVERITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'HIGH', label: 'High' },
] as const;

describe('OptionSelect', () => {
  it('is one labelled combobox that shows the current choice and reports the picked value', async () => {
    const onChange = vi.fn();
    render(
      <Field label="Severity" htmlFor="sev">
        <OptionSelect id="sev" options={SEVERITY_OPTIONS} value="LOW" onChange={onChange} />
      </Field>,
    );
    expect(screen.getAllByRole('combobox')).toHaveLength(1);
    const trigger = screen.getByLabelText('Severity');
    expect(trigger).toHaveTextContent('Low');

    await chooseOption(trigger, 'High');
    expect(onChange).toHaveBeenCalledWith('HIGH');
  });

  it('shows the "any" row as the current choice of an empty filter, and clears through it', async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <OptionSelect id="sev" aria-label="Severity" options={SEVERITY_OPTIONS} anyLabel="Any severity" value={undefined} onChange={onChange} />,
    );
    expect(screen.getByRole('combobox', { name: 'Severity' })).toHaveTextContent('Any severity');

    rerender(
      <OptionSelect id="sev" aria-label="Severity" options={SEVERITY_OPTIONS} anyLabel="Any severity" value="HIGH" onChange={onChange} />,
    );
    await chooseOption(screen.getByRole('combobox', { name: 'Severity' }), 'Any severity');
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('shows a muted placeholder, not an option, while a required field is empty', () => {
    render(<OptionSelect id="sev" aria-label="Severity" options={SEVERITY_OPTIONS} placeholder="Select…" value={undefined} onChange={vi.fn()} />);
    expect(screen.getByRole('combobox', { name: 'Severity' })).toHaveTextContent('Select…');
  });

  it('points aria-describedby at the error, not the hidden hint', () => {
    render(
      <Field label="Title" htmlFor="title" hint="Keep it short." error="Title is required.">
        <input id="title" />
      </Field>,
    );
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-describedby', 'title-error');
    expect(screen.queryByText('Keep it short.')).not.toBeInTheDocument();
  });
});

describe('CharacterCount', () => {
  it('renders the exact count / max text', () => {
    render(<CharacterCount count={120} max={4000} />);
    expect(screen.getByText('120 / 4000')).toBeInTheDocument();
  });

  it('flags going over the limit in words, not just colour', () => {
    render(<CharacterCount count={4001} max={4000} />);
    expect(screen.getByText('4001 / 4000')).toBeInTheDocument();
    expect(screen.getByText('Over the limit')).toBeInTheDocument();
  });

  it('says how many characters are still needed to reach a minimum', () => {
    render(<CharacterCount count={5} max={200} min={20} />);
    expect(screen.getByText(/15 more to go/)).toBeInTheDocument();
  });
});

describe('TablePagination', () => {
  it('disables Previous on the first page and Next on the last', () => {
    const onPageChange = vi.fn();
    const { rerender } = render(<TablePagination page={1} totalPages={3} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    screen.getByRole('button', { name: 'Next page' }).click();
    expect(onPageChange).toHaveBeenCalledWith(2);

    rerender(<TablePagination page={3} totalPages={3} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
  });
});
