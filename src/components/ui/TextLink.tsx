import type { ReactElement } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../lib/cn';

type TextLinkProps = LinkProps;

/** The inline `text-sm font-medium text-blue-600 hover:underline` link style shared
 * across the app's feedback screens — extracted once it appeared a third time
 * (tailwind.md). */
export function TextLink({ className, ...rest }: TextLinkProps): ReactElement {
  return <Link className={cn('text-sm font-medium text-blue-600 hover:underline', className)} {...rest} />;
}
