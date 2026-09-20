// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Toaster, resolveValue, toast, type ToastType } from 'react-hot-toast';
import { AlertCircle, CheckCircle2, Info, Loader2, X, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { LABELS } from '../../lib/labels';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ToastAnnouncer } from './ToastAnnouncer';

type ToastIcon = Readonly<{ icon: LucideIcon; className: string; accentClassName: string }>;

const TOAST_ICONS: Readonly<Record<ToastType, ToastIcon>> = {
  success: { icon: CheckCircle2, className: 'text-success', accentClassName: 'before:bg-success' },
  error: { icon: AlertCircle, className: 'text-destructive', accentClassName: 'before:bg-destructive' },
  loading: {
    icon: Loader2,
    className: 'animate-spin text-muted-foreground motion-reduce:animate-none',
    accentClassName: 'before:bg-primary',
  },
  blank: { icon: Info, className: 'text-info', accentClassName: 'before:bg-info' },
  custom: { icon: Info, className: 'text-info', accentClassName: 'before:bg-info' },
};

/**
 * The app's single toast surface: every `useToast().show(...)` call (via
 * ToastProvider) and every direct react-hot-toast call renders here. The render prop
 * replaces the library's default bar, which is styled by runtime-injected un-layered
 * CSS that would beat the layered Tailwind utilities.
 *
 * Bottom-right on desktop, bottom-centre on phones. The visual toasts carry no live
 * region of their own — ToastAnnouncer's two persistent regions do the announcing,
 * which screen readers pick up far more reliably than freshly inserted nodes.
 */
export function HotToaster(): ReactElement {
  const isWide = useMediaQuery('(min-width: 640px)');

  return (
    <>
      <Toaster
        position={isWide ? 'bottom-right' : 'bottom-center'}
        gutter={10}
        containerClassName="bottom-4! sm:bottom-6! sm:right-6!"
        toastOptions={{ duration: 4500, error: { duration: 7000 } }}
      >
        {(t) => {
          const visual = TOAST_ICONS[t.type];
          const Icon = visual.icon;
          return (
            <div
              className={cn(
                'pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border border-border bg-card py-3 pl-4 pr-3 text-sm text-card-foreground shadow-lg sm:w-96',
                'before:absolute before:inset-y-0 before:left-0 before:w-1',
                visual.accentClassName,
                t.visible
                  ? 'animate-in fade-in slide-in-from-bottom-2 duration-300 ease-smooth'
                  : 'animate-out fade-out slide-out-to-right-4 fill-mode-forwards duration-200',
              )}
            >
              <Icon className={cn('mt-0.5 size-4.5 shrink-0', visual.className)} aria-hidden="true" />
              <div className="min-w-0 flex-1 break-words font-medium leading-snug text-foreground-soft">
                {resolveValue(t.message, t)}
              </div>
              {t.type !== 'loading' && (
                <button
                  type="button"
                  onClick={() => toast.dismiss(t.id)}
                  aria-label={LABELS.chrome.dismiss}
                  className="-my-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          );
        }}
      </Toaster>
      <ToastAnnouncer />
    </>
  );
}
