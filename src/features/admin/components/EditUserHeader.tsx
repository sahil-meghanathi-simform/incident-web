// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { SheetDescription, SheetHeader, SheetTitle } from '../../../components/ui/Sheet';
import { Avatar } from '../../../components/ui/Avatar';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { RoleBadge } from './RoleBadge';
import { ClearanceBadge } from './ClearanceBadge';
import { formatDateTime } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import type { AdminUserRow } from '../../../api/contracts/admin.contract';

type EditUserHeaderProps = Readonly<{
  user: AdminUserRow;
}>;

/** Who is being edited, and their SAVED state — drafts live in the sections below. */
export function EditUserHeader({ user }: EditUserHeaderProps): ReactElement {
  return (
    <SheetHeader className="gap-3 border-b border-border pb-5">
      <div className="flex items-center gap-3">
        <Avatar name={user.displayName} className="h-12 w-12 text-sm" />
        <div className="min-w-0">
          <SheetTitle className="truncate">{LABELS.admin.editUserDrawerTitle(user.displayName)}</SheetTitle>
          <SheetDescription className="truncate">{user.email}</SheetDescription>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <RoleBadge role={user.role} />
        <StatusBadge
          isActive={user.isActive}
          activeLabel={LABELS.admin.statusActive}
          inactiveLabel={LABELS.admin.statusInactive}
        />
        <ClearanceBadge level={user.clearanceLevel} />
      </div>
      <p className="text-xs text-muted-foreground">{LABELS.admin.memberSince(formatDateTime(user.createdAt))}</p>
    </SheetHeader>
  );
}
