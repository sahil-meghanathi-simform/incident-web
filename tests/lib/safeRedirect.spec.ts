import { describe, it, expect } from 'vitest';
import { resolvePostLoginRedirect } from '../../src/lib/safeRedirect';
import { ROUTES } from '../../src/app/routes';

describe('resolvePostLoginRedirect', () => {
  const fallback = ROUTES.incidentNew;

  it('rejects a protocol-relative target (open redirect via a leading //)', () => {
    expect(resolvePostLoginRedirect('//evil.com', fallback)).toBe(fallback);
  });

  it('rejects a target containing a backslash', () => {
    expect(resolvePostLoginRedirect('/\\evil.com', fallback)).toBe(fallback);
  });

  it('rejects a target that is not one of the app routes', () => {
    expect(resolvePostLoginRedirect('/not-a-real-route', fallback)).toBe(fallback);
  });

  it('rejects a null target', () => {
    expect(resolvePostLoginRedirect(null, fallback)).toBe(fallback);
  });

  it('accepts a known static route', () => {
    expect(resolvePostLoginRedirect(ROUTES.incidents, fallback)).toBe(ROUTES.incidents);
  });

  it('accepts a known static route with a query string', () => {
    const target = `${ROUTES.incidents}?severity=HIGH`;
    expect(resolvePostLoginRedirect(target, fallback)).toBe(target);
  });

  it('accepts a path matching a known dynamic route prefix', () => {
    const target = ROUTES.incidentDetail('abc123');
    expect(resolvePostLoginRedirect(target, fallback)).toBe(target);
  });
});
