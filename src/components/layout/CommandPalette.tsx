// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, LogOut, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/Dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../ui/Command';
import { useNavGroups } from '../../hooks/useNavGroups';
import { useLogoutConfirm } from '../../features/auth/hooks/useLogoutConfirm';
import { ROUTES } from '../../app/routes';
import { LABELS } from '../../lib/labels';

type CommandPaletteProps = Readonly<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}>;

export const MAIN_CONTENT_ID = 'main-content';

/**
 * Ctrl/⌘+K quick-jump. Page entries come straight from useNavGroups, so the palette
 * only ever offers what the sidebar offers for this role (route guards remain the
 * real gate). Free text becomes an incident search via the list page's existing
 * `?q=` parameter — no new API.
 */
export function CommandPalette({ isOpen, onOpenChange }: CommandPaletteProps): ReactElement {
  const groups = useNavGroups();
  const navigate = useNavigate();
  const { requestLogout } = useLogoutConfirm();
  const [query, setQuery] = useState('');
  const trimmed = query.trim();

  function go(to: string): void {
    onOpenChange(false);
    setQuery('');
    navigate(to);
  }

  function handleLogout(): void {
    onOpenChange(false);
    setQuery('');
    requestLogout();
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery('');
      }}
    >
      <DialogContent
        className="top-[12dvh] max-w-xl translate-y-0 overflow-hidden p-0 sm:p-0 [&>button]:hidden"
        onCloseAutoFocus={(event) => {
          // After jumping somewhere, start the next Tab from the new page's content
          // rather than the (now irrelevant) trigger button.
          event.preventDefault();
          document.getElementById(MAIN_CONTENT_ID)?.focus();
        }}
      >
        <DialogTitle className="sr-only">{LABELS.palette.title}</DialogTitle>
        <DialogDescription className="sr-only">{LABELS.palette.description}</DialogDescription>
        <Command loop>
          <CommandInput value={query} onValueChange={setQuery} placeholder={LABELS.palette.placeholder} />
          <CommandList>
            {/* With text typed there is always the search action below, so "no
                matches" only makes sense for an empty query. */}
            {trimmed.length === 0 && <CommandEmpty>{LABELS.palette.empty}</CommandEmpty>}
            {trimmed.length > 0 && (
              // cmdk hides a group whose items don't match the query; this group and
              // its item are force-mounted so free text always offers a search.
              <CommandGroup forceMount heading={LABELS.palette.actionsGroup}>
                <CommandItem
                  forceMount
                  value={`search-incidents ${trimmed}`}
                  onSelect={() => go(`${ROUTES.incidents}?${new URLSearchParams({ q: trimmed }).toString()}`)}
                >
                  <Search aria-hidden="true" />
                  <span className="truncate">{LABELS.palette.searchIncidents(trimmed)}</span>
                  <CommandShortcut>
                    <CornerDownLeft className="size-3.5" aria-hidden="true" />
                  </CommandShortcut>
                </CommandItem>
              </CommandGroup>
            )}
            {groups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map((item) => (
                  <CommandItem key={item.to} value={`${item.label} ${group.label}`} onSelect={() => go(item.to)}>
                    <item.icon aria-hidden="true" />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandGroup heading={LABELS.palette.accountGroup}>
              <CommandItem value={LABELS.palette.logOut} onSelect={handleLogout}>
                <LogOut aria-hidden="true" />
                {LABELS.palette.logOut}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
