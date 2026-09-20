// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Tooltip } from '../ui/Tooltip';
import type { NavGroup, NavItem } from '../../hooks/useNavGroups';

type NavListProps = Readonly<{
  groups: readonly NavGroup[];
  /** Icon-only rail: labels become screen-reader text and show as tooltips. */
  isCollapsed?: boolean;
  onNavigate?: () => void;
}>;

function isExcluded(item: NavItem, pathname: string): boolean {
  return (item.excludes ?? []).some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

// Worked out here rather than by NavLink: the collapsed rail wraps each link in a
// Tooltip, whose Radix Slot merges `className` by string-joining — NavLink's
// className *function* came out as its own source text, which dropped
// `justify-center` and put the active ring on every item. A plain Link with a
// string className survives the merge.
function isCurrentItem(item: NavItem, pathname: string): boolean {
  return matchPath({ path: item.to, end: item.end ?? false }, pathname) !== null && !isExcluded(item, pathname);
}

/**
 * The sidebar's grouped links, shared by the desktop SideNav and the mobile sheet.
 * Rendered on the deep-plum sidebar surface. The active item gets a glass chip, a
 * left accent bar and a heavier weight — so it never relies on colour alone — and
 * aria-current="page" tells assistive tech the same thing.
 */
export function NavList({ groups, isCollapsed = false, onNavigate }: NavListProps): ReactElement {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          {isCollapsed ? (
            <div className="mx-auto mb-2 h-px w-6 bg-primary-foreground/15" aria-hidden="true" />
          ) : (
            <h2 className="mb-1.5 truncate px-3 font-display text-xs font-semibold uppercase tracking-caps text-primary-foreground/70">
              {group.label}
            </h2>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isCurrent = isCurrentItem(item, pathname);
              return (
                <li key={item.to}>
                  <Tooltip label={item.label} side="right" isEnabled={isCollapsed}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-lg py-2 text-sm font-medium outline-none transition-colors duration-150',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground!',
                        isCollapsed ? 'justify-center px-2' : 'px-3',
                        isCurrent
                          ? 'bg-primary-foreground/15 font-semibold text-primary-foreground ring-1 ring-primary-foreground/20 before:absolute before:inset-y-2 before:-left-3 before:w-1 before:rounded-r-full before:bg-primary-foreground'
                          : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground',
                      )}
                    >
                      <item.icon className="size-4.5 shrink-0" aria-hidden="true" />
                      <span className={cn('truncate', isCollapsed && 'sr-only')}>{item.label}</span>
                    </Link>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
