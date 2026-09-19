// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { useNavGroups } from '../../hooks/useNavGroups';

/** Desktop-only (hidden below md: — AppShell's MobileNav Sheet covers narrow
 * viewports) — grouped, icon-labeled nav shared with MobileNav via useNavGroups. */
export function SideNav(): ReactElement {
  const groups = useNavGroups();

  return (
    <nav aria-label="Main navigation" className="hidden w-56 shrink-0 space-y-4 overflow-y-auto border-r border-border bg-card p-3 md:block">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 py-1 font-display text-xs font-semibold uppercase tracking-caps text-muted-foreground">{group.label}</p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
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
  );
}
