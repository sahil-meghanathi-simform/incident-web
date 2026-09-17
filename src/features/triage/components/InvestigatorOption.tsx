import type { ReactElement } from 'react';
import { cn } from '../../../lib/cn';
import type { AssignableInvestigator } from '../types/triage.type';

type InvestigatorOptionProps = Readonly<{
  investigator: AssignableInvestigator;
  selected: boolean;
  onSelect: () => void;
}>;

export function InvestigatorOption({ investigator, selected, onSelect }: InvestigatorOptionProps): ReactElement {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center justify-between rounded-md border p-3 text-sm transition-colors',
        selected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-300 hover:bg-slate-50',
      )}
    >
      <span className="flex items-center gap-2 font-medium text-slate-900">
        <input type="radio" name="investigator" role="radio" aria-checked={selected} checked={selected} onChange={onSelect} />
        {investigator.displayName}
      </span>
      <span className="text-xs text-slate-500">Clearance {investigator.clearanceLevel}</span>
    </label>
  );
}
