import type { ZodError } from 'zod';

export const toFieldErrors = (error: ZodError): Record<string, string> => {
  const fields: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path.join('.');

    if (field && !(field in fields)) {
      fields[field] = issue.message;
    }
  }

  return fields;
};
