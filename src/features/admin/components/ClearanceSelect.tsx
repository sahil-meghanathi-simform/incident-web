// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { OptionSelect, type SelectOption } from '../../../components/ui/OptionSelect';
import { LABELS } from '../../../lib/labels';

const CLEARANCE_LEVELS = [1, 2, 3, 4] as const;

// The select speaks strings; the level rides along so the choice maps back to a
// number by lookup rather than by parsing.
const OPTIONS = CLEARANCE_LEVELS.map((level) => ({
  value: String(level),
  label: LABELS.admin.clearanceLevelOption(level),
  level,
})) satisfies ReadonlyArray<SelectOption<string> & { level: number }>;

type ClearanceSelectProps = Readonly<{
  id: string;
  value: number;
  disabled?: boolean;
  onChange: (clearanceLevel: number) => void;
  /** Set by Field, which clones it onto its direct child. */
  'aria-describedby'?: string;
}>;

export function ClearanceSelect({ value, onChange, ...rest }: ClearanceSelectProps): ReactElement {
  return (
    <OptionSelect
      options={OPTIONS}
      value={String(value)}
      onChange={(next) => {
        const match = OPTIONS.find((opt) => opt.value === next);
        if (match) onChange(match.level);
      }}
      {...rest}
    />
  );
}
