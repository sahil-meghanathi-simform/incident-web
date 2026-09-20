import {
  LayoutDashboard,
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
import { LABELS } from '../lib/labels';

export type NavItem = Readonly<{
  to: string;
  label: string;
  icon: LucideIcon;
  /** Match the path exactly (for `/` and for parents of other nav items). */
  end?: boolean;
  /** Sub-paths that belong to a different nav item, so this one isn't also active. */
  excludes?: readonly string[];
}>;

export type NavGroup = Readonly<{
  label: string;
  items: readonly NavItem[];
}>;

const NAV = LABELS.nav.items;

/** Grouped, icon-labeled nav items shared by the desktop SideNav, the mobile
 * Sheet nav and the command palette — one source so they can never drift apart,
 * and all three are filtered by the same role checks. */
export function useNavGroups(): readonly NavGroup[] {
  const { canTriage, canInvestigate, canAdminister } = usePermissions();

  const groups: NavGroup[] = [
    {
      label: LABELS.nav.groups.overview,
      items: [{ to: ROUTES.home, label: NAV.dashboard, icon: LayoutDashboard, end: true }],
    },
    {
      label: LABELS.nav.groups.report,
      items: [
        { to: ROUTES.incidentNew, label: NAV.reportIncident, icon: FilePlus },
        {
          to: ROUTES.incidents,
          label: NAV.incidents,
          icon: List,
          excludes: [ROUTES.incidentNew, ROUTES.incidentMine],
        },
        { to: ROUTES.incidentMine, label: NAV.myReports, icon: User },
      ],
    },
    {
      label: LABELS.nav.groups.work,
      items: [
        ...(canTriage ? [{ to: ROUTES.triageQueue, label: NAV.triageQueue, icon: Inbox }] : []),
        ...(canInvestigate ? [{ to: ROUTES.investigations, label: NAV.investigations, icon: Search }] : []),
        ...(canTriage ? [{ to: ROUTES.closuresPending, label: NAV.pendingClosures, icon: CheckSquare }] : []),
      ],
    },
    {
      label: LABELS.nav.groups.monitor,
      items: [
        { to: ROUTES.escalations, label: NAV.escalations, icon: TrendingUp },
        { to: ROUTES.analytics, label: NAV.analytics, icon: BarChart3 },
        { to: ROUTES.notifications, label: NAV.notifications, icon: Bell },
      ],
    },
    {
      label: LABELS.nav.groups.admin,
      items: canAdminister
        ? [
            { to: ROUTES.adminUsers, label: NAV.users, icon: Users },
            { to: ROUTES.adminEscalationPolicy, label: NAV.escalationPolicy, icon: Shield },
            { to: ROUTES.adminJobs, label: NAV.jobDiagnostics, icon: Activity },
            { to: ROUTES.adminAudit, label: NAV.auditLog, icon: ScrollText },
          ]
        : [],
    },
  ];

  return groups.filter((group) => group.items.length > 0);
}
