import { createContext } from 'react';

export type ReportIncidentContextValue = Readonly<{
  isOpen: boolean;
  /** Opens the report dialog over whatever screen the user is already on. */
  open: () => void;
  close: () => void;
}>;

export const ReportIncidentContext = createContext<ReportIncidentContextValue | null>(null);
