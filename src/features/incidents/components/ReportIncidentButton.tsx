// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Plus, type LucideIcon } from 'lucide-react';
import { Button, type ButtonVariant, type ButtonSize } from '../../../components/ui/Button';
import { useReportIncident } from '../hooks/useReportIncident';
import { LABELS } from '../../../lib/labels';

type ReportIncidentButtonProps = Readonly<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  label?: string;
  className?: string;
}>;

/** The one control that opens the report dialog — the dashboard hero, both list
 * headers and both empty states use it, so the copy, the icon and the action can't
 * drift apart between them (components.md). */
export function ReportIncidentButton({
  variant,
  size,
  icon: Icon = Plus,
  label = LABELS.incidents.reportAction,
  className,
}: ReportIncidentButtonProps): ReactElement {
  const { open } = useReportIncident();

  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={open}>
      <Icon aria-hidden="true" />
      {label}
    </Button>
  );
}
