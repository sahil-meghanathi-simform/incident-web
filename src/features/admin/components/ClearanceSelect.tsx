import type { ReactElement } from 'react';
import { Select } from '../../../components/ui/Select';

const CLEARANCE_LEVELS = [1, 2, 3, 4] as const;

type ClearanceSelectProps = Readonly<{
  id: string;
  value: number;
  disabled?: boolean;
  onChange: (clearanceLevel: number) => void;
}>;

export function ClearanceSelect({ id, value, disabled, onChange }: ClearanceSelectProps): ReactElement {
  return (
    <Select id={id} value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))}>
      {CLEARANCE_LEVELS.map((level) => (
        <option key={level} value={level}>
          Level {level}
        </option>
      ))}
    </Select>
  );
}
