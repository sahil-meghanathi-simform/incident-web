import type { ReactElement } from 'react';
import { Badge } from './Badge';
import { STAGE_LABEL, STAGE_COLOR_CLASS, type Stage } from '../../lib/stage';

export function StageBadge({ stage }: { stage: Stage }): ReactElement {
  return <Badge className={STAGE_COLOR_CLASS[stage]}>{STAGE_LABEL[stage]}</Badge>;
}
