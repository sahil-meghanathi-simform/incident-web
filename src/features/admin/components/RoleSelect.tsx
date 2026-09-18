import type { ReactElement } from 'react';
import { Select } from '../../../components/ui/Select';
import { RoleValues, type Role } from '../../../api/contracts/enums';

type RoleSelectProps = Readonly<{
  id: string;
  value: Role;
  disabled?: boolean;
  onChange: (role: Role) => void;
}>;

export function RoleSelect({ id, value, disabled, onChange }: RoleSelectProps): ReactElement {
  return (
    <Select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value as Role)}>
      {RoleValues.map((role) => (
        <option key={role} value={role}>
          {role.replaceAll('_', ' ')}
        </option>
      ))}
    </Select>
  );
}
