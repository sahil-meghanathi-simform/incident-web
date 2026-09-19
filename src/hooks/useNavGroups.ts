import {
  FilePlus,
  List,
  User,
  Inbox,
  Search,
  CheckSquare,
  TrendingUp,
  BarChart3,
  Bell,
  Users,
  Shield,
  Activity,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';
import { usePermissions } from './usePermissions';
import { ROUTES } from '../app/routes';

export type NavItem = Readonly<{
  to: string;
  label: string;
  icon: LucideIcon;
}>;

export type NavGroup = Readonly<{
  label: string;
  items: readonly NavItem[];
}>;

/** Grouped, icon-labeled nav items shared by the desktop SideNav and the
 * mobile Sheet nav — one source so the two can never drift apart. */
export function useNavGroups(): readonly NavGroup[] {
  const { canTriage, canInvestigate, canAdminister } = usePermissions();

  const groups: NavGroup[] = [
    {
      label: 'Report',
      items: [
        { to: ROUTES.incidentNew, label: 'Report incident', icon: FilePlus },
        { to: ROUTES.incidents, label: 'Incidents', icon: List },
        { to: ROUTES.incidentMine, label: 'My reports', icon: User },
      ],
    },
    {
      label: 'Work',
      items: [
        ...(canTriage ? [{ to: ROUTES.triageQueue, label: 'Triage queue', icon: Inbox }] : []),
        ...(canInvestigate ? [{ to: ROUTES.investigations, label: 'Investigations', icon: Search }] : []),
        ...(canTriage ? [{ to: ROUTES.closuresPending, label: 'Pending closures', icon: CheckSquare }] : []),
      ],
    },
    {
      label: 'Monitor',
      items: [
        { to: ROUTES.escalations, label: 'Escalations', icon: TrendingUp },
        { to: ROUTES.analytics, label: 'Analytics', icon: BarChart3 },
        { to: ROUTES.notifications, label: 'Notifications', icon: Bell },
      ],
    },
    {
      label: 'Admin',
      items: canAdminister
        ? [
            { to: ROUTES.adminUsers, label: 'Users', icon: Users },
            { to: ROUTES.adminEscalationPolicy, label: 'Escalation policy', icon: Shield },
            { to: ROUTES.adminJobs, label: 'Job diagnostics', icon: Activity },
            { to: ROUTES.adminAudit, label: 'Audit log', icon: ScrollText },
          ]
        : [],
    },
  ];

  return groups.filter((group) => group.items.length > 0);
}
