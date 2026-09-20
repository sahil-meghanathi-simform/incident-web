// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { Menu, ShieldAlert } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/Sheet';
import { useNavGroups } from '../../hooks/useNavGroups';
import { NavList } from './NavList';
import { LABELS } from '../../lib/labels';

/** Below md: — the desktop SideNav is hidden and this hamburger + Sheet takes
 * over, sharing the same grouped nav items via NavList/useNavGroups. */
export function MobileNav(): ReactElement {
  const groups = useNavGroups();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={LABELS.chrome.sideNavToggle}
          className="inline-flex size-9 items-center justify-center rounded-md text-foreground-soft transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="scrollbar-inverse max-w-72 border-r-0 bg-foreground bg-linear-to-b from-foreground to-brand-deep p-0 text-primary-foreground sm:p-0 [&>button]:text-primary-foreground/80 [&>button]:hover:bg-primary-foreground/10 [&>button]:hover:text-primary-foreground"
      >
        <SheetHeader className="mb-0 flex-row items-center gap-2.5 border-b border-primary-foreground/10 px-5 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
            <ShieldAlert className="size-5" aria-hidden="true" />
          </span>
          <SheetTitle className="text-primary-foreground">{LABELS.nav.appShortTitle}</SheetTitle>
          <SheetDescription className="sr-only">{LABELS.nav.appTitle}</SheetDescription>
        </SheetHeader>
        <nav aria-label={LABELS.chrome.sideNavLabel} className="scrollbar-stable min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain py-5 pl-4 pr-1.5">
          <NavList groups={groups} onNavigate={() => setIsOpen(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
