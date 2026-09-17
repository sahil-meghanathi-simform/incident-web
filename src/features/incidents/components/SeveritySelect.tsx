import { cn } from '../../../lib/cn';
import { SEVERITY_RANK } from '../../../lib/severity';
import type { SeverityOption } from '../types/incident.type';

interface SeveritySelectProps {
  options: SeverityOption[];
  value: SeverityOption['value'] | undefined;
  onChange: (value: SeverityOption['value']) => void;
  userClearance: number;
  error?: string;
}

const HELP_TEXT: Record<SeverityOption['value'], string> = {
  LOW: 'Routine — visible to any staff member.',
  MEDIUM: 'Elevated — visible from clearance 2 up.',
  HIGH: 'Serious — starts the escalation clock; visible from clearance 3 up.',
  CRITICAL: 'Most severe — starts the escalation clock; visible to clearance 4 only.',
};

/**
 * Per-level help text defuses the Q7+Q9 surprise here, before submit, rather than
 * leaving a clearance-1 reporter to discover it only after their CRITICAL report 403s
 * them on the very next screen.
 */
export function SeveritySelect({ options, value, onChange, userClearance, error }: SeveritySelectProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="block text-sm font-medium text-slate-700">
        Severity<span className="text-red-500"> *</span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const aboveClearance = SEVERITY_RANK[option.value] > userClearance;
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer flex-col rounded-md border p-3 text-sm transition-colors',
                selected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-300 hover:bg-slate-50',
              )}
            >
              <span className="flex items-center gap-2 font-medium text-slate-900">
                <input
                  type="radio"
                  name="severity"
                  value={option.value}
                  checked={selected}
                  onChange={() => onChange(option.value)}
                />
                {option.label}
              </span>
              <span className="mt-1 text-xs text-slate-500">{HELP_TEXT[option.value]}</span>
              {aboveClearance && (
                <span className="mt-1 text-xs font-medium text-amber-700">
                  Above your clearance — you may not be able to view this report afterwards.
                </span>
              )}
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </fieldset>
  );
}
