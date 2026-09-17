import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type HeadingProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

/** The `text-lg font-semibold text-slate-900` heading style shared by every card/page
 * title in the app — extracted once it appeared a third time (tailwind.md). */
export function Heading({ children, className }: HeadingProps): ReactElement {
  return <h1 className={cn('text-lg font-semibold text-slate-900', className)}>{children}</h1>;
}
