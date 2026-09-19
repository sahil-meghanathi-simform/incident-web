// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../lib/cn';

type TextLinkProps = LinkProps;

/** The inline `text-sm font-medium text-primary hover:underline` link style shared
 * across the app's feedback screens — extracted once it appeared a third time
 * (tailwind.md). */
export function TextLink({ className, ...rest }: TextLinkProps): ReactElement {
  return <Link className={cn('text-sm font-medium text-primary hover:underline', className)} {...rest} />;
}
