// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ClipboardList, FileText, Search, ShieldCheck, type LucideIcon } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { LABELS } from '../../../lib/labels';
import type { Role } from '../../../api/contracts/enums';

type RoleBadgeProps = Readonly<{
  role: Role;
}>;

type BadgeTone = 'neutral' | 'outline' | 'info' | 'primary';

const ROLE_ICON: Readonly<Record<Role, LucideIcon>> = {
  REPORTER: FileText,
  TRIAGE_MANAGER: ClipboardList,
  INVESTIGATOR: Search,
  ADMIN: ShieldCheck,
};

const ROLE_TONE: Readonly<Record<Role, BadgeTone>> = {
  REPORTER: 'neutral',
  TRIAGE_MANAGER: 'info',
  INVESTIGATOR: 'outline',
  ADMIN: 'primary',
};

/** A role as icon + readable word ("Triage manager"), never the raw enum. */
export function RoleBadge({ role }: RoleBadgeProps): ReactElement {
  const Icon = ROLE_ICON[role];
  return (
    <Badge tone={ROLE_TONE[role]}>
      <Icon className="size-3" aria-hidden="true" />
      {LABELS.admin.roleLabelFor(role)}
    </Badge>
  );
}
