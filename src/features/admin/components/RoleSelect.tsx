// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { OptionSelect, type SelectOption } from '../../../components/ui/OptionSelect';
import { RoleValues, type Role } from '../../../api/contracts/enums';
import { LABELS } from '../../../lib/labels';

type RoleSelectProps = Readonly<{
  id: string;
  value: Role;
  disabled?: boolean;
  onChange: (role: Role) => void;
  /** Set by Field, which clones it onto its direct child. */
  'aria-describedby'?: string;
}>;

const OPTIONS: ReadonlyArray<SelectOption<Role>> = RoleValues.map((role) => ({
  value: role,
  label: LABELS.admin.roleLabelFor(role),
}));

export function RoleSelect({ onChange, ...rest }: RoleSelectProps): ReactElement {
  // No `anyLabel`, so the select never reports undefined.
  return <OptionSelect options={OPTIONS} onChange={(next) => next && onChange(next)} {...rest} />;
}
