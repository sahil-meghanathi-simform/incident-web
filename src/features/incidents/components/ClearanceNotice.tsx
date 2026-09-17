import { useState, type ReactElement } from 'react';
import { Button } from '../../../components/ui/Button';

type ClearanceNoticeProps = Readonly<{
  reference: string;
}>;

/** Q9's landing spot: a reference and no dead link, rather than a 403 discovered later. */
export function ClearanceNotice({ reference }: ClearanceNoticeProps): ReactElement {
  const [copied, setCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. an insecure context) — the reference is already
      // shown on screen, so copying is a convenience, not the only way to retain it.
    }
  }

  return (
    <div className="rounded-md bg-amber-50 px-4 py-3 text-left text-sm text-amber-900">
      <p className="font-medium">You may not be able to view this report</p>
      <p className="mt-1 text-amber-800">
        This incident was filed at a severity above your clearance level. An investigator or
        manager can still act on it — keep the reference below if you need to follow up.
      </p>
      <Button type="button" variant="secondary" className="mt-3" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy reference'}
      </Button>
    </div>
  );
}
