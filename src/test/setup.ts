import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// vitest.config.ts runs with `globals: false`, so React Testing Library's own
// auto-cleanup (which only registers itself against a *global* afterEach) never fires —
// without this, DOM from one test in a file leaks into the next.
afterEach(() => {
  cleanup();
});
