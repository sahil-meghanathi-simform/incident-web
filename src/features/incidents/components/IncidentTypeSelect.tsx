import { forwardRef, type SelectHTMLAttributes } from 'react';
import { Select } from '../../../components/ui/Select';
import type { IncidentTypeOption } from '../types/incident.type';

interface IncidentTypeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: IncidentTypeOption[];
  hasError?: boolean;
}

export const IncidentTypeSelect = forwardRef<HTMLSelectElement, IncidentTypeSelectProps>(function IncidentTypeSelect(
  { options, ...rest },
  ref,
) {
  return (
    <Select ref={ref} {...rest}>
      <option value="">Select a type…</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
});
