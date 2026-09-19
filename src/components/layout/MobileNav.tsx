// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/Sheet';
import { cn } from '../../lib/cn';
import { useNavGroups } from '../../hooks/useNavGroups';
import { LABELS } from '../../lib/labels';

/** Below md: — the desktop SideNav is hidden and this hamburger + Sheet takes
 * over, sharing the same grouped nav items via useNavGroups. */
export function MobileNav(): ReactElement {
  const groups = useNavGroups();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={LABELS.chrome.sideNavToggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground-soft hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="max-w-64 p-0">
        <SheetHeader className="border-b border-border p-3">
          <SheetTitle className="px-3">{LABELS.nav.appTitle}</SheetTitle>
        </SheetHeader>
        <nav aria-label={LABELS.chrome.sideNavLabel} className="space-y-4 overflow-y-auto p-3">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 py-1 font-display text-xs font-semibold uppercase tracking-caps text-muted-foreground">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive ? 'bg-accent text-primary' : 'text-foreground-soft hover:bg-accent',
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
