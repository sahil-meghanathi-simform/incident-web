// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { Card } from '../../../components/ui/Card';

type AuthCardProps = Readonly<{
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}>;

/** The form card inside AuthLayout. LoginPage and RegisterPage are different component
 * types, so this remounts — and replays its entrance — on every switch between them. */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps): ReactElement {
  return (
    <Card className="w-full max-w-md rounded-xl p-6 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500 ease-smooth sm:p-8">
      <h1 className="font-display text-2xl font-semibold tracking-display text-foreground">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
      {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </Card>
  );
}
