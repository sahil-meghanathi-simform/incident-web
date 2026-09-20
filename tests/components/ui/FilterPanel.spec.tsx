import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { FilterPanel } from '../../../src/components/ui/FilterPanel';

/** jsdom has no matchMedia, which useMediaQuery reads as "doesn't match" — the mobile
 * sheet. Stubbing it to match switches the panel to its desktop popover. */
function stubViewport(isDesktop: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    (query: string): MediaQueryList => ({
      matches: isDesktop,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  );
}

function renderPanel(activeCount: number, onReset = vi.fn()) {
  render(
    <FilterPanel title="Filter things" activeCount={activeCount} resetLabel="Clear all" onReset={onReset}>
      <label>
        <input type="checkbox" /> Only mine
      </label>
    </FilterPanel>,
  );
  return onReset;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.each([
  { name: 'desktop popover', isDesktop: true },
  { name: 'mobile sheet', isDesktop: false },
])('FilterPanel — $name', ({ isDesktop }) => {
  it('keeps the controls out of the page until the Filters button is pressed', () => {
    stubViewport(isDesktop);
    renderPanel(0);
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('names the button with the active count and shows it as a badge', () => {
    stubViewport(isDesktop);
    renderPanel(3);
    expect(within(screen.getByRole('button', { name: 'Filters (3)' })).getByText('3')).toBeInTheDocument();
  });

  it('opens a labelled dialog holding the controls and a live count', () => {
    stubViewport(isDesktop);
    renderPanel(2);
    fireEvent.click(screen.getByRole('button', { name: 'Filters (2)' }));
    const dialog = screen.getByRole('dialog', { name: 'Filter things' });
    expect(within(dialog).getByRole('checkbox', { name: /only mine/i })).toBeInTheDocument();
    expect(within(dialog).getByText('2 filters applied')).toBeInTheDocument();
  });

  it('resets from inside the panel, and only when something is set', () => {
    stubViewport(isDesktop);
    const onReset = renderPanel(1);
    fireEvent.click(screen.getByRole('button', { name: 'Filters (1)' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Clear all' }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('disables reset when nothing is set, and Done closes the panel', () => {
    stubViewport(isDesktop);
    renderPanel(0);
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('button', { name: 'Clear all' })).toBeDisabled();
    expect(within(dialog).getByText('No filters applied')).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
