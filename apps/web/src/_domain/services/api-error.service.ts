import { UNKNOWN_ERROR_MESSAGE } from '../models/constants/api.constants';
import type { ApiErrorBody } from '../models/types/api.types';

const hasErrorBody = (error: unknown): error is { data: ApiErrorBody } =>
  typeof error === 'object' && error !== null && 'data' in error;

export const getErrorMessage = (error: unknown): string => {
  if (!hasErrorBody(error)) {
    return UNKNOWN_ERROR_MESSAGE;
  }

  const { message } = error.data;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  return message ?? UNKNOWN_ERROR_MESSAGE;
};

export const getErrorFields = (error: unknown): Record<string, string> =>
  hasErrorBody(error) ? (error.data.fields ?? {}) : {};
