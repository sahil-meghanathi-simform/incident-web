// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { forwardRef } from 'react';
import { OptionSelect } from '../../../components/ui/OptionSelect';
import { LABELS } from '../../../lib/labels';
import type { IncidentTypeOption } from '../types/incident.type';

type IncidentType = IncidentTypeOption['value'];

type IncidentTypeSelectProps = Readonly<{
  id: string;
  options: readonly IncidentTypeOption[];
  /** Undefined until the reporter picks one — the trigger shows the placeholder. */
  value: IncidentType | undefined;
  onChange: (value: IncidentType) => void;
  onBlur?: () => void;
  hasError?: boolean;
  disabled?: boolean;
  /** Set by Field, which clones it onto its direct child. */
  'aria-describedby'?: string;
}>;

/** The ref lands on the trigger button, so react-hook-form can focus it when the
 * type is the first invalid field on submit. */
export const IncidentTypeSelect = forwardRef<HTMLButtonElement, IncidentTypeSelectProps>(function IncidentTypeSelect(
  { onChange, ...rest },
  ref,
) {
  return (
    <OptionSelect
      triggerRef={ref}
      className="h-10"
      placeholder={LABELS.incidents.form.typePlaceholder}
      // No `anyLabel` here, so the select never reports undefined.
      onChange={(next) => next && onChange(next)}
      {...rest}
    />
  );
});
