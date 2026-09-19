import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, List, User, Inbox, Search, CheckSquare, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { usePermissions } from '../../../hooks/usePermissions';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

type QuickLink = Readonly<{ to: string; label: string; icon: LucideIcon }>;

export function QuickLinksCard(): ReactElement {
  const { canTriage, canInvestigate } = usePermissions();

  const links: QuickLink[] = [
    { to: ROUTES.incidentNew, label: LABELS.dashboard.reportIncident, icon: FilePlus },
    { to: ROUTES.incidents, label: LABELS.dashboard.viewIncidents, icon: List },
    { to: ROUTES.incidentMine, label: LABELS.dashboard.myReports, icon: User },
    ...(canTriage ? [{ to: ROUTES.triageQueue, label: LABELS.dashboard.triageQueue, icon: Inbox }] : []),
    ...(canInvestigate ? [{ to: ROUTES.investigations, label: LABELS.dashboard.investigations, icon: Search }] : []),
    ...(canTriage ? [{ to: ROUTES.closuresPending, label: LABELS.dashboard.pendingClosures, icon: CheckSquare }] : []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{LABELS.dashboard.quickLinksTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2.5 rounded-md border border-border bg-muted px-3 py-2.5 text-sm font-medium text-foreground-soft transition-colors hover:bg-accent hover:text-primary"
            >
              <link.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
