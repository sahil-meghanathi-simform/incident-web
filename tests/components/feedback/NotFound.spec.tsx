import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from '../../../src/components/feedback/NotFound';

describe('NotFound', () => {
  it('explains the missing page and offers ways back', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1, name: "We couldn't find that page" })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to dashboard' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Incidents' })).toHaveAttribute('href', '/incidents');
    // The old placeholder copy must never come back as the 404.
    expect(screen.queryByText('Not built yet')).not.toBeInTheDocument();
  });
});
