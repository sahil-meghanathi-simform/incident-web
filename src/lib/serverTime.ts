/**
 * Server-time offset, captured from the most recent response's `Date` header
 * (api/client.ts). A `SlaCountdown` ticks locally from `dueAt` on a 1s timer — this is
 * what keeps that countdown correct on a client whose own clock is skewed, without a
 * WebSocket or a poll per tick (Q31).
 */
let offsetMs = 0;

export function recordServerDate(headerValue: string | null): void {
  if (!headerValue) return;
  const serverMs = Date.parse(headerValue);
  if (Number.isNaN(serverMs)) return;
  offsetMs = serverMs - Date.now();
}

/** Best estimate of the server's current time: the local clock plus the last-seen skew. */
export function serverNow(): Date {
  return new Date(Date.now() + offsetMs);
}
