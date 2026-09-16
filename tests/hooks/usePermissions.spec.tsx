import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { usePermissions } from '../../src/hooks/usePermissions';
import { AuthContext, type AuthContextValue } from '../../src/app/AuthProvider';

function wrapper(value: AuthContextValue) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
}

describe('usePermissions — UI affordances only, never the authorization boundary', () => {
  it('a clearance-3 investigator can triage/investigate but not administer, and sees up to HIGH', () => {
    const user = { id: 'u1', email: 'i@b.com', displayName: 'I', role: 'INVESTIGATOR' as const, clearanceLevel: 3 };
    const { result } = renderHook(() => usePermissions(), {
      wrapper: wrapper({ user, status: 'authenticated', refetch: () => {} }),
    });

    expect(result.current.canInvestigate).toBe(true);
    expect(result.current.canTriage).toBe(false);
    expect(result.current.canAdminister).toBe(false);
    expect(result.current.canSeeSeverity('HIGH')).toBe(true);
    expect(result.current.canSeeSeverity('CRITICAL')).toBe(false);
  });

  it('an anonymous session (no user) cannot see any severity and has no permissions', () => {
    const { result } = renderHook(() => usePermissions(), {
      wrapper: wrapper({ user: null, status: 'anonymous', refetch: () => {} }),
    });

    expect(result.current.canTriage).toBe(false);
    expect(result.current.canInvestigate).toBe(false);
    expect(result.current.canAdminister).toBe(false);
    expect(result.current.canSeeSeverity('LOW')).toBe(false);
  });
});
