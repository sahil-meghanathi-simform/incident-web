// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';
import type { AssignableInvestigator } from '../types/triage.type';

type InvestigatorOptionProps = Readonly<{
  investigator: AssignableInvestigator;
  selected: boolean;
  onSelect: () => void;
}>;

/** A radio card. The native radio stays in the DOM (visually hidden) so arrow-key
 * navigation and form semantics come for free; the card mirrors its checked and
 * focus state, and the check mark means selection never rests on colour alone. */
export function InvestigatorOption({ investigator, selected, onSelect }: InvestigatorOptionProps): ReactElement {
  return (
    <label
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-3 text-sm transition-[border-color,box-shadow,background-color] duration-150 ease-smooth',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
        selected ? 'border-primary bg-accent/50 ring-1 ring-primary' : 'border-border hover:border-primary/40 hover:bg-accent/40',
      )}
    >
      <input
        type="radio"
        name="investigator"
        role="radio"
        aria-checked={selected}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <Avatar name={investigator.displayName} className="size-9" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-foreground">{investigator.displayName}</span>
        <Badge tone="neutral" className="mt-1">
          <ShieldCheck className="size-3" aria-hidden="true" />
          {LABELS.triage.clearanceBadge(investigator.clearanceLevel)}
        </Badge>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
          selected ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-card',
        )}
      >
        {selected && <Check className="size-3.5 animate-in zoom-in-50 duration-150 motion-reduce:animate-none" />}
      </span>
    </label>
  );
}
