import { UNKNOWN_ERROR_MESSAGE } from '../models/constants/api.constants';
import type { ApiErrorBody } from '../models/types/api.types';

const hasErrorBody = (error: unknown): error is { data: ApiErrorBody } =>
  typeof error === 'object' && error !== null && 'data' in error;

export const getErrorMessage = (error: unknown): string =>
  hasErrorBody(error)
    ? (error.data.errors?.message ?? UNKNOWN_ERROR_MESSAGE)
    : UNKNOWN_ERROR_MESSAGE;

export const getErrorFields = (error: unknown): Record<string, string> =>
  hasErrorBody(error) ? (error.data.errors?.fields ?? {}) : {};

export const hasFieldErrors = (error: unknown): boolean =>
  Object.keys(getErrorFields(error)).length > 0;

export const applyFieldErrors = <TField extends string>(
  error: unknown,
  fields: readonly TField[],
  setFieldError: (field: TField, message: string) => void,
): void => {
  const serverFields = getErrorFields(error);

  for (const field of fields) {
    const message = serverFields[field];

    if (message !== undefined) {
      setFieldError(field, message);
    }
  }
};
