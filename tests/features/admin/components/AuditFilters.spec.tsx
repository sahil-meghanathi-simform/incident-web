import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { AuditFilters } from '../../../../src/features/admin/components/AuditFilters';
import { AUDIT_EVENT_GROUPS, matchingGroup, withGroupSelection } from '../../../../src/features/admin/lib/auditEventGroups';
import { AuditEventTypeValues } from '../../../../src/api/contracts/enums';
import type { AuditSearchFilters } from '../../../../src/features/admin/schemas/auditSearch.schema';

const BASE: AuditSearchFilters = { page: 1, pageSize: 25 };
const CLOSURE = AUDIT_EVENT_GROUPS.find((group) => group.key === 'closure');

function renderFilters(filters: Partial<AuditSearchFilters> = {}) {
  const onChange = vi.fn();
  render(<AuditFilters filters={{ ...BASE, ...filters }} onChange={onChange} />);
  return onChange;
}

function openPanel(buttonName: string | RegExp = 'Filters'): HTMLElement {
  fireEvent.click(screen.getByRole('button', { name: buttonName }));
  return screen.getByRole('dialog', { name: /filter the audit log/i });
}

describe('auditEventGroups', () => {
  it('gives every event type exactly one family', () => {
    const grouped = AUDIT_EVENT_GROUPS.flatMap((group) => group.types);
    expect([...grouped].sort()).toEqual([...AuditEventTypeValues].sort());
  });

  it('matches a family only when the selection is exactly that family', () => {
    expect(matchingGroup(['CLOSURE_REJECTED', 'CLOSURE_PROPOSED', 'CLOSURE_APPROVED'])?.key).toBe('closure');
    expect(matchingGroup(['CLOSURE_PROPOSED'])).toBeUndefined();
    expect(matchingGroup(undefined)).toBeUndefined();
  });

  it("changes one family's picks without touching another's", () => {
    if (!CLOSURE) throw new Error('closure group missing');
    expect(withGroupSelection(['ACCESS_DENIED', 'CLOSURE_PROPOSED'], CLOSURE, ['CLOSURE_REJECTED'])).toEqual([
      'CLOSURE_REJECTED',
      'ACCESS_DENIED',
    ]);
  });
});

describe('AuditFilters', () => {
  it('shows all events by default and switches to a family in one click', () => {
    const onChange = renderFilters();
    expect(screen.getByRole('radio', { name: 'All events' })).toBeChecked();

    fireEvent.click(screen.getByRole('radio', { name: 'Closure' }));
    expect(onChange).toHaveBeenCalledWith({ type: ['CLOSURE_PROPOSED', 'CLOSURE_APPROVED', 'CLOSURE_REJECTED'] });
  });

  it('lights the matching family and sums it up as one chip, counted once', () => {
    const onChange = renderFilters({ type: ['CLOSURE_PROPOSED', 'CLOSURE_APPROVED', 'CLOSURE_REJECTED'] });
    expect(screen.getByRole('radio', { name: 'Closure' })).toBeChecked();
    expect(screen.getByRole('button', { name: 'Filters (1)' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /remove filter: events: closure/i }));
    expect(onChange).toHaveBeenCalledWith({ type: undefined });
  });

  it('lights no view for a hand-picked mix, and lists each type as its own chip', () => {
    renderFilters({ type: ['ACCESS_DENIED', 'NOTE_ADDED'], actorId: 'user-1' });
    expect(screen.getByRole('radio', { name: 'All events' })).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Filters (3)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove filter: actor: user-1/i })).toBeInTheDocument();
  });

  it('returns to every event from the All events view', () => {
    const onChange = renderFilters({ type: ['ACCESS_DENIED'] });
    fireEvent.click(screen.getByRole('radio', { name: 'All events' }));
    expect(onChange).toHaveBeenCalledWith({ type: undefined });
  });

  it('picks several event types in the panel, keeping picks from other families', () => {
    const onChange = renderFilters({ type: ['ACCESS_DENIED'] });
    const dialog = openPanel('Filters (1)');

    fireEvent.click(within(dialog).getByRole('button', { name: 'Closure rejected' }));
    expect(onChange).toHaveBeenCalledWith({ type: ['CLOSURE_REJECTED', 'ACCESS_DENIED'] });
  });

  it('filters by date from the panel and clears everything in one go', () => {
    const onChange = renderFilters({ actorId: 'user-1' });
    const dialog = openPanel('Filters (1)');

    fireEvent.change(within(dialog).getByLabelText('From'), { target: { value: '2026-01-01' } });
    expect(onChange).toHaveBeenCalledWith({ from: '2026-01-01', to: undefined });

    fireEvent.click(within(dialog).getByRole('button', { name: 'Clear all' }));
    expect(onChange).toHaveBeenLastCalledWith({
      type: undefined,
      actorId: undefined,
      incidentId: undefined,
      from: undefined,
      to: undefined,
    });
  });
});
