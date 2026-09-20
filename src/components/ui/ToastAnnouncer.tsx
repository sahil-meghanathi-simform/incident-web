// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { resolveValue, useToasterStore } from 'react-hot-toast';

/**
 * Two always-present live regions — polite for success/info, assertive for errors —
 * that read out the newest visible toast. A region that exists before its text
 * changes is announced reliably; a toast node inserted with its own role often
 * isn't. Toasts created with `aria-live: 'off'` (their message is already announced
 * by an inline alert, e.g. the login form) are skipped here.
 */
export function ToastAnnouncer(): ReactElement {
  const { toasts } = useToasterStore();
  const latest = toasts.find((t) => t.visible && t.ariaProps['aria-live'] !== 'off');
  const message = latest ? resolveValue(latest.message, latest) : null;
  const text = typeof message === 'string' ? message : '';
  const isError = latest?.type === 'error';

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isError ? '' : text}
      </div>
      <div className="sr-only" role="alert" aria-live="assertive" aria-atomic="true">
        {isError ? text : ''}
      </div>
    </>
  );
}
