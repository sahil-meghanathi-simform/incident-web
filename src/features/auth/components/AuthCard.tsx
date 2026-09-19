import type { ReactElement, ReactNode } from 'react';
import { Card } from '../../../components/ui/Card';

type AuthCardProps = Readonly<{
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}>;

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps): ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm p-6">
        <h1 className="font-display text-lg font-semibold tracking-display text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-5">{children}</div>
        {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
      </Card>
    </div>
  );
}
