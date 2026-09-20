// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { forwardRef, useEffect, useState, type ReactElement } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button, buttonVariants } from '../../../components/ui/Button';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';
import { ACCEPTED_IMAGE_TYPES } from '../schemas/incident.schema';

type IncidentImageInputProps = Readonly<{
  id: string;
  value: File | null;
  onChange: (file: File | null) => void;
  onBlur: () => void;
  hasError: boolean;
  disabled?: boolean;
  'aria-describedby'?: string;
}>;

const COPY = LABELS.incidents.form;

/**
 * Uncontrolled-by-design, like every native file input — `value` only ever flows in
 * to render the preview/filename; the browser refuses to let JS set a file input's
 * value directly, so onChange reads the picked File back out via the DOM event.
 *
 * components.md's one sanctioned raw-input case: a visually hidden file input whose
 * `<label>` is the trigger — a real `<label htmlFor>` opens the native picker with no
 * JS and no ref-click, so that's what "Choose photo" / "Replace photo" are, styled
 * with buttonVariants (the shared recipe) rather than a real Button component.
 */
export const IncidentImageInput = forwardRef<HTMLInputElement, IncidentImageInputProps>(function IncidentImageInput(
  { id, value, onChange, onBlur, hasError, disabled, 'aria-describedby': ariaDescribedBy },
  ref,
): ReactElement {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // A file input never fires `change` for re-picking the exact file it already holds
  // (the browser sees no value change) — remounting via `key` after Remove is what
  // makes "choose the same file again" actually register a second time.
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  function handleRemove(): void {
    onChange(null);
    setResetCount((n) => n + 1);
  }

  const triggerLabel = value ? COPY.replaceImage : COPY.chooseImage;

  return (
    <div className="space-y-3">
      {value && previewUrl && (
        <div className="flex items-center gap-3">
          <img
            src={previewUrl}
            alt={COPY.imagePreviewAlt}
            className="size-20 shrink-0 rounded-md border border-border object-cover"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm text-foreground-soft">{value.name}</p>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemove} disabled={disabled}>
              <X aria-hidden="true" />
              {COPY.removeImage}
            </Button>
          </div>
        </div>
      )}
      <label
        htmlFor={id}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer',
        )}
      >
        <ImagePlus aria-hidden="true" />
        {triggerLabel}
      </label>
      {/* rules-ok: visually hidden file input whose label above is the trigger —
          the sanctioned raw-input case named in components.md. */}
      <input
        key={resetCount}
        ref={ref}
        id={id}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="sr-only"
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
        aria-invalid={hasError}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        onBlur={onBlur}
      />
    </div>
  );
});
