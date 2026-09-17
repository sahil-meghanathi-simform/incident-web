import type { ReactElement } from 'react';
import { Badge } from './Badge';
import { SEVERITY_LABEL, SEVERITY_COLOR_CLASS, type Severity } from '../../lib/severity';

export function SeverityBadge({ severity }: { severity: Severity }): ReactElement {
  return <Badge className={SEVERITY_COLOR_CLASS[severity]}>{SEVERITY_LABEL[severity]}</Badge>;
}
