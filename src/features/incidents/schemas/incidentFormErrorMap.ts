import { ZodIssueCode, type ZodErrorMap } from 'zod';
import { createIncidentSchema } from './incident.schema';
import { LABELS } from '../../../lib/labels';

const ERRORS = LABELS.incidents.form.errors;
const TITLE_RULE = createIncidentSchema.shape.title;
const DESCRIPTION_RULE = createIncidentSchema.shape.description;

/**
 * The report form validates against the vendored contract schema, which carries no
 * messages of its own — so Zod's defaults ("Invalid enum value. Expected 'SAFETY' |
 * …, received ''") were reaching the reporter verbatim. The contract is synced from
 * the API and not ours to edit; this map, handed to zodResolver, words each issue by
 * field instead. Limits are read off the schema so the copy can't drift from it. A
 * never-touched field arrives as `undefined` (invalid_type), which reads the same to
 * the reporter as "too short".
 */
export const incidentFormErrorMap: ZodErrorMap = (issue, ctx) => {
  const isTooBig = issue.code === ZodIssueCode.too_big;
  switch (issue.path[0]) {
    case 'type':
      return { message: ERRORS.typeRequired };
    case 'severity':
      return { message: ERRORS.severityRequired };
    case 'title':
      return {
        message: isTooBig
          ? ERRORS.titleTooLong(TITLE_RULE.maxLength ?? 0)
          : ERRORS.titleTooShort(TITLE_RULE.minLength ?? 0),
      };
    case 'description':
      return {
        message: isTooBig
          ? ERRORS.descriptionTooLong(DESCRIPTION_RULE.maxLength ?? 0)
          : ERRORS.descriptionTooShort(DESCRIPTION_RULE.minLength ?? 0),
      };
    default:
      return { message: ctx.defaultError };
  }
};
