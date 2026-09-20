// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { CheckCircle2, CircleDashed, type LucideIcon } from 'lucide-react';
import { Badge } from './Badge';

type StatusBadgeProps = Readonly<{
  isActive: boolean;
  activeLabel: string;
  inactiveLabel: string;
}>;

const ICON: Readonly<Record<'active' | 'inactive', LucideIcon>> = {
  active: CheckCircle2,
  inactive: CircleDashed,
};

/** An on/off status as icon + word + tone — readable in greyscale. */
export function StatusBadge({ isActive, activeLabel, inactiveLabel }: StatusBadgeProps): ReactElement {
  const Icon = ICON[isActive ? 'active' : 'inactive'];
  return (
    <Badge tone={isActive ? 'success' : 'neutral'}>
      <Icon className="size-3" aria-hidden="true" />
      {isActive ? activeLabel : inactiveLabel}
    </Badge>
  );
}
