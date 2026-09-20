import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'ui:sidebar-collapsed';

// Same-tab subscribers: the `storage` event only fires in *other* tabs, so a
// toggle here notifies this tab's listeners directly.
const listeners = new Set<() => void>();

// Set only when storage refuses the write, so the toggle still works for this
// session instead of reading back the stale "expanded" default forever.
let sessionFallback: boolean | null = null;

function readCollapsed(): boolean {
  if (sessionFallback !== null) return sessionFallback;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    // Storage blocked (private mode, sandboxed iframe) — fall back to expanded.
    return false;
  }
}

function writeCollapsed(value: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Not persisted — remembered in memory so this session still updates.
    sessionFallback = value;
  }
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent): void => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export type UseSidebarCollapsedReturn = Readonly<{
  isCollapsed: boolean;
  toggle: () => void;
}>;

/** The desktop sidebar's collapsed-to-icons preference — a per-browser UI
 * convenience (never app data), kept in localStorage and synced across tabs. */
export function useSidebarCollapsed(): UseSidebarCollapsedReturn {
  const isCollapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);
  const toggle = useCallback(() => writeCollapsed(!readCollapsed()), []);
  return { isCollapsed, toggle };
}
