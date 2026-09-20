// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { BarChart3, Bell, CheckSquare, Compass, Inbox, Search, Siren, User } from 'lucide-react';
import { LinkTileCard, type TileLink } from './LinkTileCard';
import { usePermissions } from '../../../hooks/usePermissions';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

type QuickLinksCardProps = Readonly<{ className?: string | undefined }>;

/** Everyday destinations as icon tiles, filtered by role. "Report incident" and
 * "View incidents" live in the hero band, so they are not repeated here. */
export function QuickLinksCard({ className }: QuickLinksCardProps): ReactElement {
  const { canTriage, canInvestigate } = usePermissions();

  const links: TileLink[] = [
    { to: ROUTES.incidentMine, label: LABELS.dashboard.myReports, icon: User },
    ...(canTriage ? [{ to: ROUTES.triageQueue, label: LABELS.dashboard.triageQueue, icon: Inbox }] : []),
    ...(canInvestigate ? [{ to: ROUTES.investigations, label: LABELS.dashboard.investigations, icon: Search }] : []),
    ...(canTriage ? [{ to: ROUTES.closuresPending, label: LABELS.dashboard.pendingClosures, icon: CheckSquare }] : []),
    { to: ROUTES.escalations, label: LABELS.nav.items.escalations, icon: Siren },
    { to: ROUTES.analytics, label: LABELS.nav.items.analytics, icon: BarChart3 },
    { to: ROUTES.notifications, label: LABELS.nav.items.notifications, icon: Bell },
  ];

  return (
    <LinkTileCard
      title={LABELS.dashboard.quickLinksTitle}
      description={LABELS.dashboard.quickLinksDescription}
      icon={Compass}
      links={links}
      className={className}
    />
  );
}
