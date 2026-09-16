import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { ROUTES } from '../../app/routes';

const NAV_ITEMS = [
  { to: ROUTES.incidents, label: 'Incidents' },
  { to: ROUTES.incidentMine, label: 'My reports' },
  { to: ROUTES.triageQueue, label: 'Triage queue' },
  { to: ROUTES.investigations, label: 'Investigations' },
  { to: ROUTES.closuresPending, label: 'Pending closures' },
  { to: ROUTES.escalations, label: 'Escalations' },
  { to: ROUTES.analytics, label: 'Analytics' },
];

/** Nav items are filtered by role once usePermissions() exists (Module 1). */
export function SideNav() {
  return (
    <nav className="w-56 shrink-0 space-y-1 border-r border-slate-200 bg-white p-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'block rounded-md px-3 py-2 text-sm font-medium',
              isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
