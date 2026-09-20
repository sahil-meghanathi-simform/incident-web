import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { AnalyticsToolbar } from '../../../../src/features/analytics/components/AnalyticsToolbar';
import { presetToRange, type AnalyticsPeriodFilters } from '../../../../src/features/analytics/schemas/analyticsPeriod.schema';
import { matchingPreset, rangeDays, rangeProblem } from '../../../../src/features/analytics/lib/periodRange';
import type { AnalyticsPeriodActions } from '../../../../src/features/analytics/hooks/useAnalyticsPeriod';

function actions(): AnalyticsPeriodActions {
  return {
    setRange: vi.fn(),
    setPreset: vi.fn(),
    setBucket: vi.fn(),
    setTypes: vi.fn(),
    setStages: vi.fn(),
    clearFilters: vi.fn(),
    reset: vi.fn(),
  };
}

const JANUARY: AnalyticsPeriodFilters = { from: '2026-01-01', to: '2026-01-31', bucket: 'week' };

function renderToolbar(filters: AnalyticsPeriodFilters = JANUARY) {
  const spies = actions();
  render(<AnalyticsToolbar filters={filters} actions={spies} />);
  return spies;
}

function openFilters(): HTMLElement {
  fireEvent.click(screen.getByRole('button', { name: /^filters/i }));
  return screen.getByRole('dialog', { name: /refine analytics/i });
}

describe('periodRange', () => {
  it('counts both ends of a range', () => {
    expect(rangeDays({ from: '2026-01-01', to: '2026-01-31' })).toBe(31);
    expect(rangeDays({ from: '2026-01-01', to: '2026-01-01' })).toBe(1);
  });

  it('names what is wrong with a range, or nothing when it is fine', () => {
    expect(rangeProblem({ from: '2026-01-01', to: '2026-01-31' })).toBeNull();
    expect(rangeProblem({ from: '2026-01-01', to: '' })).toBe('incomplete');
    expect(rangeProblem({ from: '2026-02-01', to: '2026-01-01' })).toBe('reversed');
    expect(rangeProblem({ from: '2025-01-01', to: '2026-06-01' })).toBe('tooWide');
  });

  it('recognises a preset from its dates alone, and a custom range as none', () => {
    expect(matchingPreset(presetToRange('90d'))).toBe('90d');
    expect(matchingPreset({ from: '2026-01-01', to: '2026-01-31' })).toBeUndefined();
  });
});

describe('AnalyticsToolbar', () => {
  it('states the period, its length and the grouping in words', () => {
    renderToolbar();
    expect(screen.getByText('1–31 Jan 2026')).toBeInTheDocument();
    expect(screen.getByText(/31 days · trend grouped by week/i)).toBeInTheDocument();
  });

  it('applies a preset in one click from the toolbar', () => {
    const spies = renderToolbar();
    fireEvent.click(screen.getByRole('radio', { name: '7 days' }));
    expect(spies.setPreset).toHaveBeenCalledWith('7d');
  });

  it('lights up the preset the current dates match', () => {
    renderToolbar({ ...presetToRange('30d'), bucket: 'day' });
    expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '7 days' })).not.toBeChecked();
  });

  it('shows type and stage filters as removable chips and counts them on the button', () => {
    const spies = renderToolbar({ ...JANUARY, type: ['SAFETY', 'SECURITY'], stage: ['TRIAGE'] });
    expect(screen.getByRole('button', { name: 'Filters (3)' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /remove filter: type: safety/i }));
    expect(spies.setTypes).toHaveBeenCalledWith(['SECURITY']);

    fireEvent.click(screen.getByRole('button', { name: /clear all/i }));
    expect(spies.clearFilters).toHaveBeenCalledTimes(1);
  });

  it('opens a popover that filters by type and stage and regroups the trend', () => {
    const spies = renderToolbar();
    const dialog = openFilters();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Security' }));
    expect(spies.setTypes).toHaveBeenCalledWith(['SECURITY']);

    fireEvent.click(within(dialog).getByRole('button', { name: 'Closed' }));
    expect(spies.setStages).toHaveBeenCalledWith(['CLOSED']);

    fireEvent.click(within(dialog).getByRole('radio', { name: 'Month' }));
    expect(spies.setBucket).toHaveBeenCalledWith('month');
  });

  it('holds back a reversed custom range and says why, instead of applying it', () => {
    const spies = renderToolbar();
    const dialog = openFilters();

    fireEvent.change(within(dialog).getByLabelText('To'), { target: { value: '2025-12-01' } });
    expect(within(dialog).getByRole('alert')).toHaveTextContent(/end date is before the start date/i);
    expect(spies.setRange).not.toHaveBeenCalled();

    fireEvent.change(within(dialog).getByLabelText('To'), { target: { value: '2026-02-15' } });
    expect(within(dialog).queryByRole('alert')).not.toBeInTheDocument();
    expect(spies.setRange).toHaveBeenCalledWith({ from: '2026-01-01', to: '2026-02-15' });
  });

  it('resets everything from the popover header', () => {
    const spies = renderToolbar({ ...JANUARY, type: ['SAFETY'] });
    const dialog = openFilters();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Reset' }));
    expect(spies.reset).toHaveBeenCalledTimes(1);
  });
});
