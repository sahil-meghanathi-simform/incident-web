import { z } from 'zod';
import { CreateIncidentRequestSchema } from '../../../api/contracts/incident.contract';
import { LABELS } from '../../../lib/labels';

// Re-exported from the vendored contract rather than redefined — the report form
// validates against exactly what the backend's .strict() schema accepts.
export { CreateIncidentRequestSchema as createIncidentSchema } from '../../../api/contracts/incident.contract';
export type { CreateIncidentRequest } from '../../../api/contracts/incident.contract';

const ERRORS = LABELS.incidents.form.errors;

export const NO_IMAGE_REASON_MIN = 10;
export const NO_IMAGE_REASON_MAX = 500;
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES: readonly string[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * The photo itself never crosses the wire as JSON (incidents.api.ts sends it as a
 * separate multipart field), so it — and the requiredness rule that depends on
 * whether it's present — live only in this client-side schema, layered on top of the
 * vendored contract rather than inside it. `noImageReason`'s own min/max come out of
 * the base field here too (not reused directly) so the superRefine below is the ONE
 * place that decides whether it applies — leaving the base constraint in would fire a
 * second, differently-worded issue on the same path whenever a photo is missing and
 * the reason is too short, since a `.min()` violation still lets superRefine run.
 */
export const incidentFormSchema = CreateIncidentRequestSchema.extend({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= IMAGE_MAX_BYTES, ERRORS.imageTooLarge)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), ERRORS.imageInvalidType)
    .nullable(),
  noImageReason: z.string().trim().optional(),
}).superRefine((values, ctx) => {
  if (values.image) return; // a reason is only meaningful when there's no photo
  const reasonLength = values.noImageReason?.length ?? 0;
  if (reasonLength < NO_IMAGE_REASON_MIN) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['noImageReason'],
      message: ERRORS.noImageReasonTooShort(NO_IMAGE_REASON_MIN),
    });
  } else if (reasonLength > NO_IMAGE_REASON_MAX) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['noImageReason'],
      message: ERRORS.noImageReasonTooLong(NO_IMAGE_REASON_MAX),
    });
  }
});
export type IncidentFormValues = z.infer<typeof incidentFormSchema>;
