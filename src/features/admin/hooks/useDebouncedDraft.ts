import { useEffect, useRef, useState } from 'react';

/**
 * Local draft state for a text filter, flushed to `onCommit` once typing pauses —
 * so the URL (and the query keyed off it) updates once per pause, not per keystroke.
 * An EXTERNAL change to `value` (a removed filter chip, Clear all, the back button)
 * replaces the draft; the draft's own round-tripped commits are recognised and
 * ignored, so fast typing is never clobbered by a stale URL value.
 */
export function useDebouncedDraft(
  value: string,
  onCommit: (next: string) => void,
  delayMs = 300,
): readonly [string, (next: string) => void] {
  const [draft, setDraft] = useState(value);
  const lastCommitted = useRef(value);
  const commitRef = useRef(onCommit);

  useEffect(() => {
    commitRef.current = onCommit;
  }, [onCommit]);

  useEffect(() => {
    if (value === lastCommitted.current) return;
    lastCommitted.current = value;
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (draft === lastCommitted.current) return undefined;
    const timer = setTimeout(() => {
      lastCommitted.current = draft;
      commitRef.current(draft);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [draft, delayMs]);

  return [draft, setDraft] as const;
}
