import { createContext } from 'react';

export type LogoutConfirmContextValue = Readonly<{
  /** Opens the "Log out?" confirmation over whatever screen the user is on. */
  requestLogout: () => void;
}>;

export const LogoutConfirmContext = createContext<LogoutConfirmContextValue | null>(null);
