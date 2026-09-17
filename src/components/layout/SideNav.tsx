import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { ROUTES } from '../../app/routes';
import { usePermissions } from '../../hooks/usePermissions';

export function SideNav() {
  const { canTriage, canInvestigate } = usePermissions();

  const navItems = [
    { to: ROUTES.incidentNew, label: 'Report incident', show: true },
    { to: ROUTES.incidents, label: 'Incidents', show: true },
    { to: ROUTES.incidentMine, label: 'My reports', show: true },
    { to: ROUTES.triageQueue, label: 'Triage queue', show: canTriage },
    { to: ROUTES.investigations, label: 'Investigations', show: canInvestigate },
    { to: ROUTES.closuresPending, label: 'Pending closures', show: canTriage },
    { to: ROUTES.escalations, label: 'Escalations', show: true },
    { to: ROUTES.analytics, label: 'Analytics', show: true },
  ].filter((item) => item.show);

  return (
    <nav className="w-56 shrink-0 space-y-1 border-r border-slate-200 bg-white p-3">
      {navItems.map((item) => (
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
