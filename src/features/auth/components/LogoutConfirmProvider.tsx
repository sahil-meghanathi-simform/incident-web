// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useCallback, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { LogoutConfirmContext, type LogoutConfirmContextValue } from '../logoutConfirmContext';
import { useLogout } from '../hooks/useLogout';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

type LogoutConfirmProviderProps = Readonly<{
  children: ReactNode;
}>;

const COPY = LABELS.auth.logoutConfirm;

/**
 * Mounts the "Log out?" confirmation once, inside the authenticated shell, and
 * hands every screen below it a `requestLogout()` — the user menu and the command
 * palette both ask through here instead of logging out immediately on click.
 */
export function LogoutConfirmProvider({ children }: LogoutConfirmProviderProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useLogout();
  const navigate = useNavigate();

  const requestLogout = useCallback(() => setIsOpen(true), []);
  const value = useMemo<LogoutConfirmContextValue>(() => ({ requestLogout }), [requestLogout]);

  async function confirmLogout(): Promise<void> {
    await logout.mutateAsync();
    setIsOpen(false);
    navigate(ROUTES.login, { replace: true });
  }

  return (
    <LogoutConfirmContext.Provider value={value}>
      {children}
      {isOpen && (
        <ConfirmDialog
          isOpen={isOpen}
          title={COPY.title}
          description={COPY.body}
          confirmLabel={COPY.confirm}
          isDanger
          isLoading={logout.isPending}
          onConfirm={() => void confirmLogout()}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </LogoutConfirmContext.Provider>
  );
}
