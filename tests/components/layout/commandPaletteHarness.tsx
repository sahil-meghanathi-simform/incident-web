import { useState, type ReactElement } from 'react';
import { CommandPalette } from '../../../src/components/layout/CommandPalette';
import { LogoutConfirmProvider } from '../../../src/features/auth/components/LogoutConfirmProvider';
import { useHotkey } from '../../../src/hooks/useHotkey';

/** The same Ctrl+K wiring AppShell uses, without the rest of the shell (TopBar's
 * notification bell would need the notifications API). */
export function AppShellHotkeyHarness(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  useHotkey({ key: 'k' }, () => setIsOpen((open) => !open));
  return (
    <LogoutConfirmProvider>
      <CommandPalette isOpen={isOpen} onOpenChange={setIsOpen} />
    </LogoutConfirmProvider>
  );
}
