import { useEffect, useRef } from 'react';

type HotkeyOptions = Readonly<{
  /** The key, compared case-insensitively against KeyboardEvent.key (e.g. 'k'). */
  key: string;
  /** Require Ctrl (or ⌘ on macOS). */
  withModifier?: boolean;
  isEnabled?: boolean;
}>;

/** Registers a global keyboard shortcut on `keydown` (so preventDefault can stop the
 * browser's own binding, e.g. Ctrl+K focusing the address bar). */
export function useHotkey({ key, withModifier = true, isEnabled = true }: HotkeyOptions, onPress: () => void): void {
  const handlerRef = useRef(onPress);
  handlerRef.current = onPress;

  useEffect(() => {
    if (!isEnabled) return undefined;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.isComposing || event.repeat) return;
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      const hasModifier = event.ctrlKey || event.metaKey;
      if (withModifier !== hasModifier) return;
      event.preventDefault();
      handlerRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, withModifier, isEnabled]);
}
