import type { ReactElement, ReactNode } from 'react';
import { Heading } from '../../../components/ui/Heading';

type AuthCardProps = Readonly<{
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}>;

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps): ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Heading>{title}</Heading>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        <div className="mt-5">{children}</div>
        {footer && <div className="mt-5 text-center text-sm text-slate-500">{footer}</div>}
      </div>
    </div>
  );
}
