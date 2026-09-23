// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useCallback, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { ReportIncidentContext, type ReportIncidentContextValue } from '../reportIncidentContext';
import { ReportIncidentDialog } from './ReportIncidentDialog';

type ReportIncidentProviderProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Mounts the report-incident dialog once, inside the authenticated shell, and
 * hands every screen below it an `open()`. The dialog itself is mounted only
 * while open — the pattern the rest of the app's modals use, so its form starts
 * empty each time and its queries don't run while it's shut.
 */
export function ReportIncidentProvider({ children }: ReportIncidentProviderProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo<ReportIncidentContextValue>(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <ReportIncidentContext.Provider value={value}>
      {children}
      {isOpen && <ReportIncidentDialog isOpen onClose={close} />}
    </ReportIncidentContext.Provider>
  );
}
