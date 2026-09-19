import type { ReactElement } from 'react';

export function TimelineDayDivider({ label }: { label: string }): ReactElement {
  return (
    <li className="pt-2 text-xs font-semibold uppercase tracking-caps text-muted-foreground">
      {label}
    </li>
  );
}
