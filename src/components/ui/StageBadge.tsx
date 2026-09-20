// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Badge } from './Badge';
import { STAGE_LABEL, STAGE_DOT_CLASS, type Stage } from '../../lib/stage';

export function StageBadge({ stage }: { stage: Stage }): ReactElement {
  return (
    <Badge tone="neutral" dotClassName={STAGE_DOT_CLASS[stage]}>
      {STAGE_LABEL[stage]}
    </Badge>
  );
}
