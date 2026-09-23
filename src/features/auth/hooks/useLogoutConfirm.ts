// rules-ok: state-management.md — this IS the typed hook it asks for. The one
// useContext() call for this Context lives here, guarding a missing provider,
// so no call site ever touches useContext directly.
import { useContext } from 'react';
import { LogoutConfirmContext, type LogoutConfirmContextValue } from '../logoutConfirmContext';

/** Logging out is reachable from the user menu and the command palette, so the
 * confirmation dialog is mounted once by LogoutConfirmProvider and requested
 * through this hook rather than duplicated at each call site. */
export function useLogoutConfirm(): LogoutConfirmContextValue {
  const ctx = useContext(LogoutConfirmContext);
  if (!ctx) throw new Error('useLogoutConfirm must be used within a LogoutConfirmProvider');
  return ctx;
}
