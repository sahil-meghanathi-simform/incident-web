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
        selected ? 'border-ring ring-1 ring-ring' : 'border-input hover:bg-accent',
      )}
    >
      <span className="flex items-center gap-2 font-medium text-foreground">
        <input type="radio" name="investigator" role="radio" aria-checked={selected} checked={selected} onChange={onSelect} />
        {investigator.displayName}
      </span>
      <span className="text-xs text-muted-foreground">Clearance {investigator.clearanceLevel}</span>
    </label>
  );
}
