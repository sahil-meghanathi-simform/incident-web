import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// vitest.config.ts runs with `globals: false`, so React Testing Library's own
// auto-cleanup (which only registers itself against a *global* afterEach) never fires —
// without this, DOM from one test in a file leaks into the next.
afterEach(() => {
  cleanup();
});

// jsdom implements neither pointer capture nor scrollIntoView, and Radix Select calls
// both while opening its listbox — without these every select test throws on open.
window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.releasePointerCapture = () => undefined;
window.HTMLElement.prototype.scrollIntoView = () => undefined;

// React 18 tripwire for the shadcn/Radix migration: a component that lost its
// `forwardRef` (e.g. a fresh `npx shadcn add` reverting a hand-edit) silently breaks
// Radix's focus-restore-on-close, since `ref` on a bare function component is stripped
// before render on React 18. RTL never surfaces this as a failed assertion — it only
// ever shows up as a console.error. Promoting these two to thrown errors turns every
// existing and future test into a ref-forwarding regression test for free.
const RESTRICTED_CONSOLE_ERROR_PATTERNS = [/Function components cannot be given refs/, /validateDOMNesting/];
const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]): void => {
  const message = String(args[0] ?? '');
  if (RESTRICTED_CONSOLE_ERROR_PATTERNS.some((pattern) => pattern.test(message))) {
    throw new Error(`console.error matched a restricted pattern: ${message}`);
  }
  originalConsoleError(...args);
};
