import { useRef } from 'react';

/**
 * Every Dialog/Sheet/AlertDialog in this app is fully externally controlled
 * (`open`/`onOpenChange` driven by the parent's own state) rather than using
 * a `<Trigger>` — the button that opens one usually lives in a sibling
 * component (a table row's "Edit" button opening a drawer defined elsewhere),
 * so there's no single compound-component tree Radix can use to resolve
 * "the trigger" on its own. Empirically, Radix's own focus-restore-on-close
 * does not reliably return focus in that configuration, so this captures
 * `document.activeElement` at the moment Content mounts (during render,
 * before any effect — Radix's or ours — has a chance to move focus) and
 * hands back an `onCloseAutoFocus` handler that restores it explicitly.
 */
export function useRestoreFocusOnClose(): (event: Event) => void {
  const triggerRef = useRef<HTMLElement | null>(document.activeElement as HTMLElement | null);

  return (event: Event) => {
    event.preventDefault();
    triggerRef.current?.focus({ preventScroll: true });
  };
}
