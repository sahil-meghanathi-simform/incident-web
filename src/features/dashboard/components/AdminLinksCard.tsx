// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Cpu, ScrollText, Settings2, SlidersHorizontal, Users } from 'lucide-react';
import { LinkTileCard, type TileLink } from './LinkTileCard';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

type AdminLinksCardProps = Readonly<{ className?: string | undefined }>;

const ADMIN_LINKS: readonly TileLink[] = [
  { to: ROUTES.adminUsers, label: LABELS.nav.items.users, icon: Users },
  { to: ROUTES.adminEscalationPolicy, label: LABELS.nav.items.escalationPolicy, icon: SlidersHorizontal },
  { to: ROUTES.adminJobs, label: LABELS.nav.items.jobDiagnostics, icon: Cpu },
  { to: ROUTES.adminAudit, label: LABELS.nav.items.auditLog, icon: ScrollText },
];

/** Admin shortcuts — links only, no queries. DashboardPage renders it for admins
 * alone (a convenience; each admin route is still guarded on its own). */
export function AdminLinksCard({ className }: AdminLinksCardProps): ReactElement {
  return (
    <LinkTileCard
      title={LABELS.dashboard.adminLinksTitle}
      description={LABELS.dashboard.adminLinksDescription}
      icon={Settings2}
      links={ADMIN_LINKS}
      className={className}
    />
  );
}
