// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useNavGroups } from '../../hooks/useNavGroups';
import { useSidebarCollapsed } from '../../hooks/useSidebarCollapsed';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useHotkey } from '../../hooks/useHotkey';
import { Tooltip } from '../ui/Tooltip';
import { NavList } from './NavList';
import { ROUTES } from '../../app/routes';
import { LABELS } from '../../lib/labels';

export const SIDEBAR_ID = 'app-sidebar';

/**
 * Desktop sidebar (hidden below md: — MobileNav's sheet covers phones). Collapses to
 * an icon rail on request (Ctrl+B, remembered per browser) and is always a rail
 * between md and lg, where a full-width sidebar would crowd the content.
 */
export function SideNav(): ReactElement {
  const groups = useNavGroups();
  const { isCollapsed: prefersCollapsed, toggle } = useSidebarCollapsed();
  const isWide = useMediaQuery('(min-width: 1024px)');
  const isCollapsed = prefersCollapsed || !isWide;
  useHotkey({ key: 'b', isEnabled: isWide }, toggle);

  const toggleLabel = isCollapsed ? LABELS.nav.expandSidebar : LABELS.nav.collapseSidebar;
  const ToggleIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      id={SIDEBAR_ID}
      className={cn(
        'scrollbar-inverse relative z-20 hidden shrink-0 flex-col overflow-hidden bg-foreground bg-linear-to-b from-foreground to-brand-deep text-primary-foreground md:flex',
        'transition-[width] duration-200 ease-smooth',
        isCollapsed ? 'w-18' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 shrink-0 items-center gap-2.5 border-b border-primary-foreground/10', isCollapsed ? 'justify-center px-2' : 'px-5')}>
        <Link
          to={ROUTES.home}
          className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground!"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
            <ShieldAlert className="size-5" aria-hidden="true" />
          </span>
          <span className={cn('truncate font-display text-base font-semibold tracking-snug', isCollapsed && 'sr-only')}>
            {LABELS.nav.appShortTitle}
          </span>
        </Link>
      </div>

      {/* Expanded: the gutter is reserved (pr-1.5 + the 10px bar = the 16px of pl-4), so
          links never shift when the list starts to scroll. The rail is too narrow to
          give up a gutter, so it scrolls with the bar hidden. */}
      <nav
        aria-label={LABELS.chrome.sideNavLabel}
        className={cn(
          'min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain py-5',
          isCollapsed ? 'scrollbar-none px-3' : 'scrollbar-stable pl-4 pr-1.5',
        )}
      >
        <NavList groups={groups} isCollapsed={isCollapsed} />
      </nav>

      {isWide && (
        <div className={cn('shrink-0 border-t border-primary-foreground/10 p-3', isCollapsed && 'flex justify-center')}>
          <Tooltip label={toggleLabel} side="right" isEnabled={isCollapsed}>
            <button
              type="button"
              onClick={toggle}
              aria-controls={SIDEBAR_ID}
              aria-expanded={!isCollapsed}
              aria-keyshortcuts="Control+B"
              className={cn(
                'flex items-center gap-3 rounded-lg py-2 text-sm font-medium text-primary-foreground/80 outline-none transition-colors',
                'hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground!',
                isCollapsed ? 'justify-center px-2' : 'w-full px-3',
              )}
            >
              <ToggleIcon className="size-4.5 shrink-0" aria-hidden="true" />
              <span className={cn('truncate', isCollapsed && 'sr-only')}>{toggleLabel}</span>
            </button>
          </Tooltip>
        </div>
      )}
    </aside>
  );
}
